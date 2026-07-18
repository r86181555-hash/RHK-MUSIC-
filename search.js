import { db } from "./firebase.js";

import {
collection,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const searchInput=document.getElementById("searchInput");
const results=document.getElementById("searchResults");

const currentUser=localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

let users=[];

onSnapshot(collection(db,"users"),(snapshot)=>{

users=[];

snapshot.forEach(doc=>{

users.push(doc.data());

});

showUsers(users);

});

searchInput.oninput=()=>{

const text=searchInput.value.toLowerCase();

const filtered=users.filter(user=>

user.username.toLowerCase().includes(text)

);

showUsers(filtered);

};

function showUsers(list){

results.innerHTML="";

list.forEach(user=>{

if(user.username===currentUser) return;

results.innerHTML+=`

<div class="userCard"

onclick="openProfile('${user.username}')">

<img src="${user.dp || 'defaultdp.png'}">

<div style="flex:1;">

<h3>${user.username}</h3>

<p>${user.bio || ""}</p>

</div>

<button

onclick="event.stopPropagation();followUser('${user.username}')">

Follow

</button>

</div>

`;

});

}
/* ==============================
   RHK SEARCH.JS PART 2
============================== */

import {
doc,
getDoc,
updateDoc,
arrayUnion,
arrayRemove,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ==============================
   OPEN USER PROFILE
============================== */

window.openProfile=function(username){

localStorage.setItem("viewProfile",username);

location.href="user.html";

};

/* ==============================
   FOLLOW / UNFOLLOW
============================== */

window.followUser=async function(username){

const myRef=doc(db,"users",currentUser);

const otherRef=doc(db,"users",username);

const mySnap=await getDoc(myRef);

const otherSnap=await getDoc(otherRef);

if(!mySnap.exists() || !otherSnap.exists()) return;

const following=mySnap.data().following || [];

if(following.includes(username)){

await updateDoc(myRef,{
following:arrayRemove(username)
});

await updateDoc(otherRef,{
followers:arrayRemove(currentUser)
});

}else{

await updateDoc(myRef,{
following:arrayUnion(username)
});

await updateDoc(otherRef,{
followers:arrayUnion(currentUser)
});

}

};

/* ==============================
   LIVE SEARCH UPDATE
============================== */

onSnapshot(collection(db,"users"),(snapshot)=>{

users=[];

snapshot.forEach((doc)=>{

users.push(doc.data());

});

const text=searchInput.value.toLowerCase();

const filtered=users.filter(user=>

user.username.toLowerCase().includes(text)

);

showUsers(filtered);

});
