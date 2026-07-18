import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot,
doc,
updateDoc,
arrayUnion,
arrayRemove,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const reelsContainer=document.getElementById("reelsContainer");

/* ==========================
   LOAD REELS
========================== */

const reelsQuery=query(

collection(db,"reels"),

orderBy("createdAt","desc")

);

onSnapshot(reelsQuery,(snapshot)=>{

reelsContainer.innerHTML="";

snapshot.forEach((document)=>{

const reel=document.data();

reelsContainer.innerHTML+=`

<div class="reel">

<video

class="reelVideo"

src="${reel.video}"

autoplay

loop

playsinline

muted

></video>

<div class="reelOverlay">

<h3 onclick="openProfile('${reel.username}')">

${reel.username}

</h3>

<p>${reel.caption || ""}</p>

</div>

<div class="reelActions">

<i

class="fa-solid fa-heart"

onclick="likeReel('${document.id}')">

</i>

<span>${reel.likes || 0}</span>

<i

class="fa-solid fa-comment"

onclick="commentReel('${document.id}')">

</i>

<i

class="fa-solid fa-paper-plane"

onclick="shareReel('${document.id}')">

</i>

<i

class="fa-solid fa-volume-xmark"

onclick="toggleSound(this)">

</i>

</div>

</div>

`;

});

observeVideos();

});

/* ==========================
   AUTO PLAY
========================== */

function observeVideos(){

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

const video=entry.target;

if(entry.isIntersecting){

video.play();

}else{

video.pause();

}

});

},{threshold:0.8});

document.querySelectorAll(".reelVideo").forEach(video=>{

observer.observe(video);

});

}
/* ===========================================
   LIKE REEL
=========================================== */

window.likeReel = async function(reelId){

const reelRef = doc(db,"reels",reelId);

const snap = await getDoc(reelRef);

if(!snap.exists()) return;

const data = snap.data();

const likes = data.likedBy || [];

if(likes.includes(currentUser)){

await updateDoc(reelRef,{
likedBy:arrayRemove(currentUser),
likes:(data.likes||1)-1
});

}else{

await updateDoc(reelRef,{
likedBy:arrayUnion(currentUser),
likes:(data.likes||0)+1
});

}

};

/* ===========================================
   COMMENT
=========================================== */

window.commentReel=function(reelId){

localStorage.setItem("reelId",reelId);

location.href="comments.html";

};

/* ===========================================
   SHARE
=========================================== */

window.shareReel=function(reelId){

const url=location.origin+"/reel.html?id="+reelId;

if(navigator.share){

navigator.share({

title:"RHK Reel",

url:url

});

}else{

navigator.clipboard.writeText(url);

alert("Link copied.");

}

};

/* ===========================================
   SOUND
=========================================== */

window.toggleSound=function(icon){

const video=icon.parentElement.parentElement.querySelector("video");

video.muted=!video.muted;

icon.className=video.muted

?"fa-solid fa-volume-xmark"

:"fa-solid fa-volume-high";

};

/* ===========================================
   OPEN PROFILE
=========================================== */

window.openProfile=function(username){

localStorage.setItem("visitUser",username);

location.href="profile.html";

};
