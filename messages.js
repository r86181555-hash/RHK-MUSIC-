import { db } from "./firebase.js";

import {
collection,
query,
where,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if (!currentUser) {
    location.href = "index.html";
}

const conversationList = document.getElementById("conversationList");

/* ==================================
   LOAD CONVERSATIONS
================================== */

const chatQuery = query(
    collection(db, "messages"),
    orderBy("lastTime", "desc")
);

onSnapshot(chatQuery, (snapshot) => {

    conversationList.innerHTML = "";

    snapshot.forEach((doc) => {

        const chat = doc.data();

        if (
            !chat.members ||
            !chat.members.includes(currentUser)
        ) return;

        const otherUser = chat.members.find(
            user => user !== currentUser
        );

        conversationList.innerHTML += `

<div class="userCard"

onclick="openChat('${doc.id}','${otherUser}')">

<img src="${chat.photo || 'defaultdp.png'}">

<div style="flex:1;">

<h3>${otherUser}</h3>

<p>${chat.lastMessage || "Start chatting..."}</p>

</div>

<div style="text-align:right;">

<small>

${formatTime(chat.lastTime)}

</small>

</div>

</div>

`;

    });

});

/* ==================================
   FORMAT TIME
================================== */

function formatTime(time){

    if(!time) return "";

    try{

        const date=time.toDate();

        return date.toLocaleTimeString([],{

            hour:"2-digit",

            minute:"2-digit"

        });

    }catch{

        return "";

    }

}
/* ==========================================
   OPEN CHAT
========================================== */

window.openChat = function(chatId, otherUser){

    localStorage.setItem("chatId", chatId);
    localStorage.setItem("chatUser", otherUser);

    location.href = "chat.html";

};

/* ==========================================
   START NEW CHAT
========================================== */

window.startChat = async function(otherUser){

    const chatId =
        [currentUser, otherUser]
        .sort()
        .join("_");

    localStorage.setItem("chatId", chatId);
    localStorage.setItem("chatUser", otherUser);

    location.href = "chat.html";

};

/* ==========================================
   ONLINE STATUS
========================================== */

window.updateOnlineStatus = async function(){

    const ref = doc(db, "users", currentUser);

    await updateDoc(ref,{
        online:true,
        lastSeen:serverTimestamp()
    });

};

window.addEventListener("load", updateOnlineStatus);

window.addEventListener("beforeunload", async()=>{

    const ref = doc(db,"users",currentUser);

    await updateDoc(ref,{
        online:false,
        lastSeen:serverTimestamp()
    });

});

/* ==========================================
   LIVE
