import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc,
arrayUnion,
arrayRemove,
collection,
query,
where,
orderBy,
onSnapshot,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");
const postId = localStorage.getItem("postId");

if(!currentUser || !postId){

location.href="home.html";

}

const postContainer=document.getElementById("postContainer");
const commentText=document.getElementById("commentText");
const postComment=document.getElementById("postComment");

let postData;

/* ==========================================
   LOAD POST
========================================== */

async function loadPost(){

const snap=await getDoc(doc(db,"posts",postId));

if(!snap.exists()){

location.href="home.html";

return;

}

postData=snap.data();

const liked=(postData.likedBy||[]).includes(currentUser);

const saved=(postData.savedBy||[]).includes(currentUser);

postContainer.innerHTML=`

<div class="singlePost">

<div class="postHeader">

<img
src="${postData.dp || 'defaultdp.png'}"
class="userDP">

<div>

<h3>${postData.username}</h3>

</div>

</div>

<img
src="${postData.image}"
class="postImage">

<div class="postActions">

<i
class="${liked?'fa-solid':'fa-regular'} fa-heart"
onclick="toggleLike()"></i>

<i
class="fa-regular fa-comment"
onclick="document.getElementById('commentText').focus()"></i>

<i
class="fa-regular fa-paper-plane"
onclick="sharePost()"></i>

<i
class="${saved?'fa-solid':'fa-regular'} fa-bookmark saveIcon"
onclick="toggleSave()"></i>

</div>

<div class="postInfo">

<b>${postData.likes||0} likes</b>

<p>

<b>${postData.username}</b>

${postData.caption||""}

</p>

</div>

<div id="commentsArea"></div>

</div>

`;

loadComments();

}

loadPost();

/* ==========================================
   LOAD COMMENTS
========================================== */

function loadComments(){

const q=query(

collection(db,"comments"),

where("postId","==",postId),

orderBy("createdAt","asc")

);

onSnapshot(q,(snapshot)=>{

const comments=document.getElementById("commentsArea");

comments.innerHTML="";

snapshot.forEach((doc)=>{

const data=doc.data();

comments.innerHTML+=`

<div class="commentRow">

<b>${data.username}</b>

${data.comment}

</div>

`;

});

});

}
/* ==========================================
   LIKE / UNLIKE POST
========================================== */

window.toggleLike = async () => {

const ref = doc(db,"posts",postId);

const liked = (postData.likedBy || []).includes(currentUser);

if(liked){

await updateDoc(ref,{
likedBy:arrayRemove(currentUser),
likes:(postData.likes||1)-1
});

postData.likedBy =
(postData.likedBy||[]).filter(x=>x!==currentUser);

postData.likes=(postData.likes||1)-1;

}else{

await updateDoc(ref,{
likedBy:arrayUnion(currentUser),
likes:(postData.likes||0)+1
});

postData.likedBy=[...(postData.likedBy||[]),currentUser];

postData.likes=(postData.likes||0)+1;

/* Notification */

if(postData.username!==currentUser){

await addDoc(

collection(db,"notifications"),

{

to:postData.username,

from:currentUser,

type:"like",

message:"liked your post",

createdAt:serverTimestamp()

}

);

}

}

loadPost();

};

/* ==========================================
   SAVE / UNSAVE POST
========================================== */

window.toggleSave = async()=>{

const ref=doc(db,"posts",postId);

const saved=(postData.savedBy||[]).includes(currentUser);

if(saved){

await updateDoc(ref,{

savedBy:arrayRemove(currentUser)

});

postData.savedBy=
(postData.savedBy||[])
.filter(x=>x!==currentUser);

}else{

await updateDoc(ref,{

savedBy:arrayUnion(currentUser)

});

postData.savedBy=[
...(postData.savedBy||[]),
currentUser
];

}

loadPost();

};

/* ==========================================
   SHARE POST
========================================== */

window.sharePost=()=>{

const url=location.href;

if(navigator.share){

navigator.share({

title:"RHK Post",

url:url

});

}else{

navigator.clipboard.writeText(url);

alert("Post link copied.");

}

};
/* ==========================================
   ADD COMMENT
========================================== */

postComment.onclick = async () => {

const text = commentText.value.trim();

if(text==="") return;

await addDoc(

collection(db,"comments"),

{

postId:postId,

username:currentUser,

comment:text,

dp:localStorage.getItem("userDP") || "defaultdp.png",

createdAt:serverTimestamp()

}

);

/* Increase Comment Count */

await updateDoc(

doc(db,"posts",postId),

{

comments:(postData.comments || 0)+1

}

);

/* Send Notification */

if(postData.username!==currentUser){

await addDoc(

collection(db,"notifications"),

{

to:postData.username,

from:currentUser,

type:"comment",

message:text,

createdAt:serverTimestamp()

}

);

}

commentText.value="";

};

/* ==========================================
   POST COMMENT ON ENTER
========================================== */

commentText.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

e.preventDefault();

postComment.click();

}

});

/* ==========================================
   OPEN USER PROFILE
========================================== */

document.addEventListener("click",(e)=>{

const header=e.target.closest(".postHeader");

if(!header) return;

localStorage.setItem("visitUser",postData.username);

location.href="profile.html";

});

/* ==========================================
   DOUBLE TAP LIKE
========================================== */

document.addEventListener("dblclick",(e)=>{

if(!e.target.classList.contains("postImage")) return;

if(!(postData.likedBy||[]).includes(currentUser)){

toggleLike();

}

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="fixed";
heart.style.left="50%";
heart.style.top="50%";
heart.style.transform="translate(-50%,-50%)";
heart.style.fontSize="90px";
heart.style.pointerEvents="none";
heart.style.animation="pop .6s";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},600);

});

/* ==========================================
   DELETE POST
========================================== */

window.deletePost = async()=>{

if(postData.username!==currentUser) return;

if(!confirm("Delete this post?")) return;

await deleteDoc(doc(db,"posts",postId));

alert("Post deleted.");

location.href="profile.html";

};

/* ==========================================
   END OF POST.JS
========================================== */
