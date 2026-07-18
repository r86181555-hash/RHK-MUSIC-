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
