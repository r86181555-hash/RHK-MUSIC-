import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const preview=document.getElementById("profilePreview");
const image=document.getElementById("profileImage");

const name=document.getElementById("name");
const username=document.getElementById("username");
const bio=document.getElementById("bio");
const website=document.getElementById("website");
const phone=document.getElementById("phone");

const saveBtn=document.getElementById("saveBtn");
const status=document.getElementById("status");

let imageURL="";

/* ==========================
   LOAD PROFILE
========================== */

async function loadProfile(){

const snap=await getDoc(doc(db,"users",currentUser));

if(!snap.exists()) return;

const user=snap.data();

preview.src=user.dp || "defaultdp.png";

name.value=user.name || "";

username.value=user.username || "";

bio.value=user.bio || "";

website.value=user.website || "";

phone.value=user.phone || "";

imageURL=user.dp || "";

}

loadProfile();

/* ==========================
   IMAGE PREVIEW
========================== */

image.onchange=()=>{

const file=image.files[0];

if(!file) return;

preview.src=URL.createObjectURL(file);

};
/* ==========================================
   SAVE PROFILE
========================================== */

saveBtn.onclick = async () => {

saveBtn.disabled = true;

status.innerHTML = "Saving profile...";

try{

/* ---------- Upload New DP ---------- */

if(image.files.length){

const form = new FormData();

form.append("file",image.files[0]);

form.append("upload_preset",UPLOAD_PRESET);

const upload = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{

method:"POST",

body:form

}

);

const result = await upload.json();

imageURL = result.secure_url;

}

/* ---------- Update Firestore ---------- */

await updateDoc(

doc(db,"users",currentUser),

{

dp:imageURL,

name:name.value.trim(),

username:username.value.trim(),

bio:bio.value.trim(),

website:website.value.trim(),

phone:phone.value.trim()

}

);

/* ---------- Update Local Storage ---------- */

localStorage.setItem("userDP",imageURL);
localStorage.setItem("username",username.value.trim());

status.style.color="#4CAF50";
status.innerHTML="Profile updated successfully.";

setTimeout(()=>{

location.href="profile.html";

},1000);

}catch(error){

console.error(error);

status.style.color="#ff3b30";
status.innerHTML="Failed to update profile.";

saveBtn.disabled=false;

}

};

/* ==========================================
   END OF EDIT PROFILE
========================================== */
