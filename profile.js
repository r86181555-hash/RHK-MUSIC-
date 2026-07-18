import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc,
collection,
query,
where,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME="nhy9lfkt";
const UPLOAD_PRESET="rhk_upload";

const currentUser=localStorage.getItem("RHKUser");

if(!currentUser){
location.href="index.html";
}

const profileImage=document.getElementById("profileImage");
const username=document.getElementById("username");
const bio=document.getElementById("bio");

const followers=document.getElementById("followers");
const following=document.getElementById("following");
const postCount=document.getElementById("postCount");

const profilePosts=document.getElementById("profilePosts");

const dpInput=document.getElementById("dpInput");

const editBtn=document.getElementById("editProfile");

/* ---------------- LOAD USER ---------------- */

async function loadProfile(){

const ref=doc(db,"users",currentUser);

const snap=await getDoc(ref);

if(!snap.exists()) return;

const data=snap.data();

username.innerHTML=data.username;

bio.innerHTML=data.bio || "No bio yet";

profileImage.src=data.dp || "defaultdp.png";

followers.innerHTML=(data.followers||[]).length;

following.innerHTML=(data.following||[]).length;

}

loadProfile();

/* ---------------- LOAD POSTS ---------------- */

const postQuery=query(
collection(db,"posts"),
where("username","==",currentUser)
);

onSnapshot(postQuery,(snapshot)=>{

profilePosts.innerHTML="";

postCount.innerHTML=snapshot.size;

snapshot.forEach((doc)=>{

const post=doc.data();

profilePosts.innerHTML+=`

<div class="gridItem">

${
post.type==="video"

?

`<video src="${post.media}"></video>`

:

`<img src="${post.media}">`

}

</div>

`;

});

});

/* ---------------- EDIT BIO ---------------- */

editBtn.onclick=async()=>{

const newBio=prompt("Enter your bio");

if(newBio===null) return;

await updateDoc(doc(db,"users",currentUser),{

bio:newBio

});

loadProfile();

};

/* ---------------- CHANGE DP ---------------- */

profileImage.onclick=()=>{

dpInput.click();

};
/* ==============================
   CHANGE PROFILE PICTURE
============================== */

dpInput.onchange = async () => {

const file = dpInput.files[0];

if(!file) return;

editBtn.innerHTML="Uploading...";

const form = new FormData();

form.append("file",file);
form.append("upload_preset",UPLOAD_PRESET);

try{

const res = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{
method:"POST",
body:form
}

);

const data = await res.json();

await updateDoc(doc(db,"users",currentUser),{

dp:data.secure_url

});

profileImage.src=data.secure_url;

editBtn.innerHTML="Edit Profile";

}catch(err){

alert("Upload Failed");

editBtn.innerHTML="Edit Profile";

}

};

/* ==============================
   LIVE PROFILE UPDATE
============================== */

onSnapshot(doc(db,"users",currentUser),(snap)=>{

if(!snap.exists()) return;

const user=snap.data();

profileImage.src=user.dp || "defaultdp.png
