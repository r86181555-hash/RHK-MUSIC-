import { db } from "./firebase.js";

import {
collection,
onSnapshot,
doc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const usersCount = document.getElementById("usersCount");
const postsCount = document.getElementById("postsCount");
const reelsCount = document.getElementById("reelsCount");
const storiesCount = document.getElementById("storiesCount");

const usersList = document.getElementById("usersList");
const postsList = document.getElementById("postsList");
const reelsList = document.getElementById("reelsList");

/* ==========================================
   USERS
========================================== */

onSnapshot(collection(db,"users"),(snapshot)=>{

usersCount.innerHTML = snapshot.size;

usersList.innerHTML = "";

snapshot.forEach((document)=>{

const user = document.data();

usersList.innerHTML += `

<div class="adminCard">

<img src="${user.dp || 'defaultdp.png'}" class="userDP">

<div class="userInfo">

<h3>${user.username}</h3>

<p>${user.bio || ""}</p>

</div>

<button
onclick="deleteUser('${document.id}')">

Delete

</button>

</div>

`;

});

});

/* ==========================================
   POSTS
========================================== */

onSnapshot(collection(db,"posts"),(snapshot)=>{

postsCount.innerHTML = snapshot.size;

postsList.innerHTML = "";

snapshot.forEach((document)=>{

const post = document.data();

postsList.innerHTML += `

<div class="adminCard">

<img
src="${post.image}"
style="
width:70px;
height:70px;
object-fit:cover;
border-radius:10px;
">

<div class="userInfo">

<h3>${post.username}</h3>

<p>${post.caption || ""}</p>

</div>

<button
onclick="deletePost('${document.id}')">

Delete

</button>

</div>

`;

});

});

/* ==========================================
   REELS
========================================== */

onSnapshot(collection(db,"reels"),(snapshot)=>{

reelsCount.innerHTML = snapshot.size;

reelsList.innerHTML = "";

snapshot.forEach((document)=>{

const reel = document.data();

reelsList.innerHTML += `

<div class="adminCard">

<video
src="${reel.video}"
style="
width:70px;
height:70px;
object-fit:cover;
border-radius:10px;
">

</video>

<div class="userInfo">

<h3>${reel.username}</h3>

<p>${reel.caption || ""}</p>

</div>

<button
onclick="deleteReel('${document.id}')">

Delete

</button>

</div>

`;

});

});

/* ==========================================
   STORIES COUNT
========================================== */

onSnapshot(collection(db,"stories"),(snapshot)=>{

storiesCount.innerHTML = snapshot.size;

});

/* ==========================================
   DELETE USER
========================================== */

window.deleteUser = async(id)=>{

if(!confirm("Delete this user?")) return;

await deleteDoc(doc(db,"users",id));

};

/* ==========================================
   DELETE POST
========================================== */

window.deletePost = async(id)=>{

if(!confirm("Delete this post?")) return;

await deleteDoc(doc(db,"posts",id));

};

/* ==========================================
   DELETE REEL
========================================== */

window.deleteReel = async(id)=>{

if(!confirm("Delete this reel?")) return;

await deleteDoc(doc(db,"reels",id));

};
