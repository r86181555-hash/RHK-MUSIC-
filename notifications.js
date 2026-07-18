import { db } from "./firebase.js";

import {
collection,
query,
where,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const notificationList=document.getElementById("notificationList");

/* ===========================================
   LOAD NOTIFICATIONS
=========================================== */

const notificationQuery=query(

collection(db,"notifications"),

where("to","==",currentUser),

orderBy("createdAt","desc")

);

onSnapshot(notificationQuery,(snapshot)=>{

notificationList.innerHTML="";

if(snapshot.empty){

notificationList.innerHTML=`

<div style="
padding:60px;
text-align:center;
color:#888;
">

<h3>No Notifications</h3>

<p>You're all caught up.</p>

</div>

`;

return;

}

snapshot.forEach((doc)=>{

const data=doc.data();

let message="";

switch(data.type){

case "like":

message=`❤️ <b>${data.from}</b> liked your post`;

break;

case "comment":

message=`💬 <b>${data.from}</b> commented on your post`;

break;

case "follow":

message=`👤 <b>${data.from}</b> started following you`;

break;

case "story":

message=`📸 <b>${data.from}</b> added a new story`;

break;

default:

message=data.message || "";

}

notificationList.innerHTML+=`

<div class="notificationCard">

<img src="${data.dp || 'defaultdp.png'}">

<div style="flex:1;">

<div>${message}</div>

<small style="color:#999;">

${formatTime(data.createdAt)}

</small>

</div>

</div>

`;

});

});

/* ===========================================
   FORMAT TIME
=========================================== */

function formatTime(time){

if(!time) return "";

try{

return time.toDate().toLocaleString();

}catch{

return "";

}

}
