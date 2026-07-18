import { db } from "./firebase.js";

import {
doc,
getDoc,
collection,
onSnapshot,
query
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

const followersList = document.getElementById("followersList");
const searchFollower = document.getElementById("searchFollower");
const pageTitle = document.getElementById("pageTitle");

const profileUser =
localStorage.getItem("visitUser") || currentUser;

const page =
new URLSearchParams(location.search).get("type") || "followers";

pageTitle.innerHTML =
page === "following"
? "Following"
: "Followers";

let allUsers = [];

/* ==========================================
   LOAD USERS
========================================== */

onSnapshot(query(collection(db,"users")),async(snapshot)=>{

allUsers=[];

snapshot.forEach(doc=>{

allUsers.push(doc.data());

});

loadList();

});

/* ==========================================
   LOAD FOLLOWERS / FOLLOWING
========================================== */

async function loadList(){

followersList.innerHTML="";

const snap=await getDoc(doc(db,"users",profileUser));

if(!snap.exists()) return;

const user=snap.data();

const list=

page==="following"

?

(user.following||[])

:

(user.followers||[]);

list.forEach(username=>{

const info=

allUsers.find(x=>x.username===username);

if(!info) return;

followersList.innerHTML+=`

<div class="userCard">

<img

src="${info.dp || 'defaultdp.png'}"

class="userDP"

onclick="openProfile('${info.username}')">

<div class="userInfo">

<h3>${info.username}</h3>

<p>${info.bio || ""}</p>

</div>

<button

class="followBtn"

onclick="toggleFollow('${info.username}')">

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
arrayRemove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ==========================================
   SEARCH FOLLOWERS
========================================== */

searchFollower.addEventListener("input",()=>{

const value=searchFollower.value.toLowerCase();

document.querySelectorAll(".userCard").forEach(card=>{

const username=card.querySelector("h3")
.innerText
.toLowerCase();

card.style.display=

username.includes(value)

?

"flex"

:

"none";

});

});

/* ==========================================
   FOLLOW / UNFOLLOW
========================================== */

window.toggleFollow=async(username)=>{

const myRef=doc(db,"users",currentUser);

const userRef=doc(db,"users",username);

const mySnap=await getDoc(myRef);

const userSnap=await getDoc(userRef);

if(!mySnap.exists() || !userSnap.exists()) return;

const myData=mySnap.data();

const following=myData.following || [];

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

}

loadList();

};

/* ==========================================
   OPEN PROFILE
========================================== */

window.openProfile=(username)=>{

localStorage.setItem("visitUser",username);

location.href="profile.html";

};

/* ==========================================
   END OF FOLLOWERS.JS
========================================== */
