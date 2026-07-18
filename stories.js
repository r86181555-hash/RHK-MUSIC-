import { db } from "./firebase.js";

import {
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME="nhy9lfkt";
const UPLOAD_PRESET="rhk_upload";

const currentUser=localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const storyFile=document.getElementById("storyFile");

const storyList=document.getElementById("storyList");

/* ==========================
   UPLOAD STORY
========================== */

storyFile.onchange=async()=>{

const file=storyFile.files[0];

if(!file) return;

const form=new FormData();

form.append("file",file);

form.append("upload_preset",UPLOAD_PRESET);

const type=file.type.startsWith("video")

?"video"

:"image";

const url=

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;

try{

const response=await fetch(url,{

method:"POST",

body:form

});

const result=await response.json();

await addDoc(

collection(db,"stories"),

{

username:currentUser,

media:result.secure_url,

type:type,

createdAt:serverTimestamp(),

expiresAt:Date.now()+86400000

}

);

alert("Story uploaded.");

}catch(e){

alert("Upload failed.");

}

};

/* ==========================
   LOAD STORIES
========================== */

const storyQuery=query(

collection(db,"stories"),

orderBy("createdAt","desc")

);

onSnapshot(storyQuery,(snapshot)=>{

storyList.innerHTML="";

snapshot.forEach((doc)=>{

const story=doc.data();

if(Date.now()>story.expiresAt) return;

storyList.innerHTML+=`

<div class="story"

onclick="openStory('${doc.id}')">

<img

src="${story.type==="video"

?"defaultdp.png"

:story.media}"

>

<p>${story.username}</p>

</div>

`;

});

});
