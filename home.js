import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if (!currentUser) {
    location.href = "index.html";
}

const feed = document.getElementById("feed");
const stories = document.getElementById("stories");

/* ------------------------------
   LOAD STORIES
--------------------------------*/

const storyQuery = query(
    collection(db, "stories"),
    orderBy("createdAt", "desc")
);

onSnapshot(storyQuery, (snapshot) => {

    stories.innerHTML = "";

    snapshot.forEach((doc) => {

        const story = doc.data();

        stories.innerHTML += `

<div class="story" onclick="viewStory('${doc.id}')">

<img src="${story.dp || 'defaultdp.png'}">

<p>${story.username}</p>

</div>

`;

    });

});

/* ------------------------------
   LOAD POSTS
--------------------------------*/

const postQuery = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
);

onSnapshot(postQuery, (snapshot) => {

    feed.innerHTML = "";

    snapshot.forEach((doc) => {

        const post = doc.data();

        feed.innerHTML += `

<div class="post">

<div class="postHeader">

<div class="postLeft">

<img src="${post.dp || 'defaultdp.png'}">

<div>

<div class="username">${post.username}</div>

</div>

</div>

<i class="fa-solid fa-ellipsis"></i>

</div>

<div class="postImage">

${post.type === "video"

? `<video controls>
<source src="${post.media}">
</video>`

: `<img src="${post.media}">`

}

</div>

<div class="postActions">

<div class="leftIcons">

<i class="fa-regular fa-heart"
onclick="likePost('${doc.id}')"></i>

<i class="fa-regular fa-comment"
onclick="commentPost('${doc.id}')"></i>

<i class="fa-regular fa-paper-plane"></i>

</div>

<i class="fa-regular fa-bookmark"></i>

</div>

<div class="postCaption">

<b>${post.username}</b>

${post.caption || ""}

</div>

</div>

`;

    });

});
/* ===============================
   RHK HOME.JS PART-2
   LIKE • COMMENT • SHARE • SAVE
================================*/

import {
doc,
updateDoc,
arrayUnion,
arrayRemove,
increment,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ---------- LIKE POST ---------- */

window.likePost = async function(postId){

const postRef = doc(db,"posts",postId);

const snap = await getDoc(postRef);

if(!snap.exists()) return;

const data = snap.data();

const likes = data.likes || [];

if(likes.includes(currentUser)){

await updateDoc(postRef,{
likes:arrayRemove(currentUser),
likeCount:increment(-1)
});

}else{

await updateDoc(postRef,{
likes:arrayUnion(currentUser),
likeCount:increment(1)
});

}

}

/* ---------- COMMENT ---------- */

window.commentPost=function(postId){

location.href="comments.html?id="+postId;

}

/* ---------- SHARE ---------- */

window.sharePost=function(postId){

const url=window.location.origin+"/post.html?id="+postId;

if(navigator.share){

navigator.share({

title:"RHK",

text:"Check this post",

url:url

});

}else{

navigator.clipboard.writeText(url);

alert("Link
