import { db } from "./firebase.js";

import {
collection,
addDoc,
query,
where,
orderBy,
onSnapshot,
serverTimestamp,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

const postId = localStorage.getItem("postId") || localStorage.getItem("reelId");

const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const sendComment = document.getElementById("sendComment");

if (!currentUser) {

location.href = "index.html";

}

/* ======================================
   LOAD COMMENTS
====================================== */

const q = query(

collection(db, "comments"),

where("postId", "==", postId),

orderBy("createdAt", "asc")

);

onSnapshot(q, (snapshot) => {

commentList.innerHTML = "";

snapshot.forEach((document) => {

const data = document.data();

commentList.innerHTML += `

<div class="commentCard">

<img
src="${data.dp || 'defaultdp.png'}"
class="commentDP">

<div class="commentBody">

<b>${data.username}</b>

<p>${data.comment}</p>

<small>

${formatTime(data.createdAt)}

</small>

</div>

${
data.username===currentUser

?

`<i
class="fa-solid fa-trash deleteBtn"
onclick="deleteComment('${document.id}')">
</i>`

:

""

}

</div>

`;

});

});

/* ======================================
   FORMAT TIME
====================================== */

function formatTime(time){

if(!time) return "";

try{

return time.toDate().toLocaleString();

}catch{

return "";

}

}
/* ======================================
   ADD COMMENT
====================================== */

sendComment.onclick = async () => {

const text = commentInput.value.trim();

if(text=="") return;

await addDoc(

collection(db,"comments"),

{

postId:postId,

username:currentUser,

comment:text,

dp:localStorage.getItem("userDP") || "defaultdp.png",

likes:0,

likedBy:[],

createdAt:serverTimestamp()

}

);

commentInput.value="";

};

/* ======================================
   DELETE COMMENT
====================================== */

window.deleteComment = async function(commentId){

if(!confirm("Delete this comment?")) return;

await deleteDoc(

doc(db,"comments",commentId)

);

};

/* ======================================
   LIKE COMMENT
====================================== */

window.likeComment = async function(commentId){

const ref = doc(db,"comments",commentId);

const snap = await getDoc(ref);

if(!snap.exists()) return;

const data = snap.data();

const liked = data.likedBy || [];

if(liked.includes(currentUser)){

await updateDoc(ref,{

likedBy:arrayRemove(currentUser),

likes:(data.likes||1)-1

});

}else{

await updateDoc(ref,{

likedBy:arrayUnion(currentUser),

likes:(data.likes||0)+1

});

}

};

/* ======================================
   SEND COMMENT NOTIFICATION
====================================== */

window.sendCommentNotification = async function(postOwner){

if(postOwner===currentUser) return;

await addDoc(

collection(db,"notifications"),

{

to:postOwner,

from:currentUser,

type:"comment",

message:"commented on your post",

createdAt:serverTimestamp()

}

);

};

/* ======================================
   POST COMMENT WITH ENTER
====================================== */

commentInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendComment.click();

}

});
