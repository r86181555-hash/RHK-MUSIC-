import { db } from "./firebase.js";

import {
doc,
deleteDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

/* ==========================================
   DARK MODE
========================================== */

const darkBtn=document.getElementById("darkModeBtn");

if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light");

}

darkBtn.onclick=()=>{

document.body.classList.toggle("light");

if(document.body.classList.contains("light")){

localStorage.setItem("theme","light");

}else{

localStorage.setItem("theme","dark");

}

};

/* ==========================================
   LOGOUT
========================================== */

window.logout=function(){

if(!confirm("Logout from RHK?")) return;

localStorage.removeItem("RHKUser");
localStorage.removeItem("visitUser");
localStorage.removeItem("chatId");
localStorage.removeItem("chatUser");
localStorage.removeItem("postId");
localStorage.removeItem("reelId");

location.href="index.html";

};

/* ==========================================
   DELETE ACCOUNT
========================================== */

window.deleteAccount=async()=>{

const ok=confirm("Delete your account permanently?");

if(!ok) return;

try{

await deleteDoc(doc(db,"users",currentUser));

localStorage.clear();

alert("Account deleted.");

location.href="index.html";

}catch(e){

alert("Unable to delete account.");

}

};

/* ==========================================
   UPDATE ONLINE STATUS
========================================== */

window.addEventListener("load",async()=>{

try{

await updateDoc(doc(db,"users",currentUser),{

online:true

});

}catch(e){}

});

window.addEventListener("beforeunload",async()=>{

try{

await updateDoc(doc(db,"users",currentUser),{

online:false

});

}catch(e){}

});
