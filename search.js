import { db } from "./firebase.js";

import {
collection,
onSnapshot,
query
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const searchInput=document.getElementById("searchInput");
const searchResults=document.getElementById("searchResults");

let users=[];

/* =====================================
   LOAD USERS
===================================== */

onSnapshot(

query(collection(db,"users")),

(snapshot)=>{

users=[];

snapshot.forEach((doc)=>{

users.push(doc.data());

});

renderUsers("");

});

/* =====================================
   SEARCH INPUT
===================================== */

searchInput.addEventListener("input",(e)=>{

renderUsers(e.target.value.toLowerCase());

});

/* =====================================
   RENDER USERS
===================================== */

function renderUsers(text){

searchResults.innerHTML="";

users
.filter(user=>{

return user.username
.toLowerCase()
.includes(text)

&&

user.username!==currentUser;

})
.forEach(user=>{

searchResults.innerHTML+=`

<div class="userCard">

<img

src="${user.dp || 'defaultdp.png'}"

class="userDP"

onclick="openProfile('${user.username}')"

>

<div class="userInfo">

<h3>${user.username}</h3>

<p>${user.bio || ""}</p>

</div>

<button

class="followBtn"

onclick="followUser('${user.username}')">

Follow

</button>

</div>

`;

});

}
import {
doc,
getDoc,
updateDoc,
arrayUnion,
arrayRemove,
addDoc,
collection,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ======================================
   FOLLOW / UNFOLLOW USER
====================================== */

window.followUser = async function(username){

const myRef = doc(db,"users",currentUser);
const userRef = doc(db,"users",username);

const mySnap = await getDoc(myRef);
const userSnap = await getDoc(userRef);

if(!mySnap.exists() || !userSnap.exists()) return;

const myData = mySnap.data();
const following = myData.following || [];

if(following.includes(username)){

await updateDoc(myRef,{
following:arrayRemove(username)
});

await updateDoc(userRef,{
followers:arrayRemove(currentUser)
});

}else{

await updateDoc(myRef,{
following:arrayUnion(username)
});

await updateDoc(userRef,{
followers:arrayUnion(currentUser)
});

await addDoc(collection(db,"notifications"),{

to:username,

from:currentUser,

type:"follow",

createdAt:serverTimestamp()

});

}

renderUsers(searchInput.value.toLowerCase());

};

/* ======================================
   OPEN PROFILE
====================================== */

window.openProfile = function(username){

localStorage.setItem("visitUser",username);

location.href="profile.html";

};
