import { db } from "./firebase.js";

import {
doc,
getDoc,
addDoc,
collection,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const storyId = new URLSearchParams(location.search).get("id");

const currentUser = localStorage.getItem("RHKUser");

const storyContent = document.getElementById("storyContent");
const storyUser = document.getElementById("storyUser");
const storyDP = document.getElementById("storyDP");
const progressBar = document.getElementById("progressBar");

const replyInput = document.getElementById("replyInput");
const sendReply = document.getElementById("sendReply");

let storyData;

/* ===========================
   LOAD STORY
=========================== */

async function loadStory(){

const snap = await getDoc(doc(db,"stories",storyId));

if(!snap.exists()){

location.href="home.html";

return;

}

storyData = snap.data();

storyUser.innerHTML = storyData.username;

storyDP.src = storyData.dp || "defaultdp.png";

if(storyData.type==="image"){

storyContent.innerHTML=`

<img
src="${storyData.media}"
style="
width:100%;
height:100%;
object-fit:contain;
">

`;

startTimer(5000);

}else{

storyContent.innerHTML=`

<video
id="storyVideo"
autoplay
playsinline
style="
width:100%;
height:100%;
object-fit:contain;
">

<source src="${storyData.media}">

</video>

`;

const video=document.getElementById("storyVideo");

video.onloadedmetadata=()=>{

startTimer(video.duration*1000);

};

video.onended=()=>{

location.href="home.html";

};

}

}

loadStory();

/* ===========================
   PROGRESS BAR
=========================== */

function startTimer(time){

progressBar.style.transition="none";

progressBar.style.width="0%";

setTimeout(()=>{

progressBar.style.transition=`width ${time}ms linear`;

progressBar.style.width="100%";

},50);

setTimeout(()=>{

location.href="home.html";

},time);

}
/* ===========================================
   STORY REPLY
=========================================== */

sendReply.onclick = async () => {

const text = replyInput.value.trim();

if(text=="") return;

await addDoc(

collection(db,"storyReplies"),

{

storyId:storyId,

owner:storyData.username,

from:currentUser,

message:text,

createdAt:serverTimestamp()

}

);

replyInput.value="";

alert("Reply sent.");

};

/* ===========================================
   STORY REACTION
=========================================== */

storyContent.addEventListener("dblclick",async()=>{

await addDoc(

collection(db,"notifications"),

{

to:storyData.username,

from:currentUser,

type:"story",

message:"❤️ reacted to your story",

createdAt:serverTimestamp()

}

);

const heart=document.createElement("div");

heart.innerHTML="❤️";

heart.style.position="absolute";
heart.style.top="50%";
heart.style.left="50%";
heart.style.transform="translate(-50%,-50%)";
heart.style.fontSize="90px";
heart.style.animation="pop .6s";

document.body.appendChild(heart);

setTimeout(()=>{

heart.remove();

},600);

});

/* ===========================================
   HOLD TO PAUSE
=========================================== */

let holdTimer;

storyContent.addEventListener("touchstart",()=>{

const video=document.getElementById("storyVideo");

if(video){

video.pause();

}

progressBar.style.animationPlayState="paused";

});

storyContent.addEventListener("touchend",()=>{

const video=document.getElementById("storyVideo");

if(video){

video.play();

}

progressBar.style.animationPlayState="running";

});

/* ===========================================
   TAP TO SKIP
=========================================== */

storyContent.addEventListener("click",(e)=>{

const x=e.clientX;

if(x>window.innerWidth/2){

location.href="home.html";

}

});

/* ===========================================
   STORY SEEN
=========================================== */

addDoc(

collection(db,"storyViews"),

{

storyId:storyId,

viewer:currentUser,

owner:storyData.username,

createdAt:serverTimestamp()

}

);

/* ===========================================
   END OF STORY VIEW
=========================================== */
