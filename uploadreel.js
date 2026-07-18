import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const video=document.getElementById("video");
const preview=document.getElementById("preview");
const uploadBtn=document.getElementById("uploadBtn");
const status=document.getElementById("status");

/* ==========================
   VIDEO PREVIEW
========================== */

video.onchange=()=>{

const file=video.files[0];

if(!file) return;

preview.src=URL.createObjectURL(file);

preview.style.display="block";

};

/* ==========================
   UPLOAD REEL
========================== */

uploadBtn.onclick=async()=>{

const file=video.files[0];

const caption=document.getElementById("caption").value.trim();

if(!file){

alert("Select a video.");

return;

}

status.innerHTML="Uploading Reel...";

uploadBtn.disabled=true;

try{

const form=new FormData();

form.append("file",file);

form.append("upload_preset",UPLOAD_PRESET);

const response=await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,

{

method:"POST",

body:form

}

);

const result=await response.json();

await addDoc(

collection(db,"reels"),

{

username:currentUser,

video:result.secure_url,

caption:caption,

likes:0,

likedBy:[],

comments:0,

shares:0,

createdAt:serverTimestamp()

}

);

status.innerHTML="Reel uploaded successfully.";

setTimeout(()=>{

location.href="reels.html";

},1200);

}catch(e){

status.innerHTML="Upload failed.";

uploadBtn.disabled=false;

}

};
