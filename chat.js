import { db } from "./firebase.js";

import {
collection,
doc,
setDoc,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp,
updateDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

const chatId = localStorage.getItem("chatId");

const otherUser = localStorage.getItem("chatUser");

if(!currentUser || !chatId){

location.href="messages.html";

}

const chatArea=document.getElementById("chatArea");

const messageInput=document.getElementById("messageInput");

const sendBtn=document.getElementById("sendBtn");

const imageInput=document.getElementById("imageInput");

const chatDP=document.getElementById("chatDP");

const chatName=document.getElementById("chatName");

const chatStatus=document.getElementById("chatStatus");

/* ==========================
   LOAD USER
========================== */

onSnapshot(doc(db,"users",otherUser),(snap)=>{

if(!snap.exists()) return;

const user=snap.data();

chatDP.src=user.dp || "defaultdp.png";

chatName.innerHTML=user.username;

chatStatus.innerHTML=user.online
? "Active now"
: "Offline";

});

/* ==========================
   LOAD MESSAGES
========================== */

const messageQuery=query(

collection(db,"messages",chatId,"chat"),

orderBy("createdAt")

);

onSnapshot(messageQuery,(snapshot)=>{

chatArea.innerHTML="";

snapshot.forEach((doc)=>{

const msg=doc.data();

chatArea.innerHTML+=`

<div class="message ${msg.sender===currentUser?"sent":"received"}">

${msg.type==="image"

?

`<img
src="${msg.text}"
style="
width:220px;
border-radius:12px;
">`

:

msg.text

}

</div>

`;

});

chatArea.scrollTop=chatArea.scrollHeight;

});
/* ===========================================
   SEND TEXT MESSAGE
=========================================== */

sendBtn.onclick = async () => {

const text = messageInput.value.trim();

if(text=="") return;

await addDoc(

collection(db,"messages",chatId,"chat"),

{

sender:currentUser,

receiver:otherUser,

text:text,

type:"text",

seen:false,

createdAt:serverTimestamp()

}

);

await setDoc(

doc(db,"messages",chatId),

{

members:[currentUser,otherUser],

lastMessage:text,

lastTime:serverTimestamp()

},

{merge:true}

);

messageInput.value="";

};

/* ===========================================
   SEND ON ENTER
=========================================== */

messageInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendBtn.click();

}

});

/* ===========================================
   TYPING STATUS
=========================================== */

messageInput.oninput = async()=>{

await updateDoc(

doc(db,"users",currentUser),

{

typingTo:otherUser

}

);

};

messageInput.onblur = async()=>{

await updateDoc(

doc(db,"users",currentUser),

{

typingTo:""

}

);

};

/* ===========================================
   SHOW TYPING
=========================================== */

onSnapshot(doc(db,"users",otherUser),(snap)=>{

if(!snap.exists()) return;

const user=snap.data();

if(user.typingTo===currentUser){

chatStatus.innerHTML="Typing...";

}else{

chatStatus.innerHTML=user.online

? "Active now"

: "Offline";

}

});
/* ===========================================
   CLOUDINARY CONFIG
=========================================== */

const CLOUD_NAME = "nhy9lfkt";
const UPLOAD_PRESET = "rhk_upload";

/* ===========================================
   SEND IMAGE
=========================================== */

imageInput.onchange = async () => {

const file = imageInput.files[0];

if(!file) return;

sendBtn.disabled = true;

const form = new FormData();

form.append("file", file);
form.append("upload_preset", UPLOAD_PRESET);

try{

const response = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

{
method:"POST",
body:form
}

);

const result = await response.json();

await addDoc(

collection(db,"messages",chatId,"chat"),

{

sender:currentUser,

receiver:otherUser,

text:result.secure_url,

type:"image",

seen:false,

createdAt:serverTimestamp()

}

);

await setDoc(

doc(db,"messages",chatId),

{

members:[currentUser,otherUser],

lastMessage:"📷 Photo",

lastTime:serverTimestamp()

},

{merge:true}

);

sendBtn.disabled = false;

}catch(e){

alert("Image upload failed");

sendBtn.disabled = false;

}

};

/* ===========================================
   MARK MESSAGES AS SEEN
=========================================== */

onSnapshot(

collection(db,"messages",chatId,"chat"),

(snapshot)=>{

snapshot.forEach(async(document)=>{

const message=document.data();

if(

message.receiver===currentUser &&

message.seen===false

){

await updateDoc(document.ref,{

seen:true

});

}

});

});

/* ===========================================
   DOUBLE TAP ❤️
=========================================== */

chatArea.addEventListener("dblclick",(e)=>{

const msg=e.target.closest(".message");

if(!msg) return;

msg.innerHTML += `

<div style="
font-size:20px;
margin-top:6px;
">

❤️

</div>

`;

});
/* ===========================================
   DELETE MESSAGE
=========================================== */

chatArea.addEventListener("contextmenu", async (e)=>{

e.preventDefault();

const msg=e.target.closest(".message");

if(!msg) return;

if(!confirm("Delete this message?")) return;

const id=msg.dataset.id;

if(!id) return;

await deleteDoc(

doc(db,"messages",chatId,"chat",id)

);

});

/* ===========================================
   COPY MESSAGE
=========================================== */

chatArea.addEventListener("click",(e)=>{

const msg=e.target.closest(".message");

if(!msg) return;

if(msg.querySelector("img")) return;

navigator.clipboard.writeText(msg.innerText);

});

/* ===========================================
   VOICE MESSAGE (COMING SOON)
=========================================== */

const voiceBtn=document.createElement("i");

voiceBtn.className="fa-solid fa-microphone";

voiceBtn.style.cursor="pointer";

voiceBtn.style.fontSize="24px";

document.querySelector(".chatInput").prepend(voiceBtn);

voiceBtn.onclick=()=>{

alert("Voice messages coming soon.");

};

/* ===========================================
   EMOJI SHORTCUTS
=========================================== */

const emojis=["😀","😂","😍","❤️","🔥","😭","👍"];

const emojiBox=document.createElement("div");

emojiBox.style.display="none";
emojiBox.style.position="absolute";
emojiBox.style.bottom="70px";
emojiBox.style.left="10px";
emojiBox.style.background="#1c1c1c";
emojiBox.style.padding="10px";
emojiBox.style.borderRadius="12px";

emojis.forEach(emoji=>{

const span=document.createElement("span");

span.innerHTML=emoji;

span.style.fontSize="24px";
span.style.margin="6px";
span.style.cursor="pointer";

span.onclick=()=>{

messageInput.value+=emoji;

emojiBox.style.display="none";

};

emojiBox.appendChild(span);

});

document.body.appendChild(emojiBox);

document.querySelector(".fa-face-smile").onclick=()=>{

emojiBox.style.display=
emojiBox.style.display==="none"
?"block"
:"none";

};

/* ===========================================
   AUTO SCROLL
=========================================== */

const observer=new MutationObserver(()=>{

chatArea.scrollTop=chatArea.scrollHeight;

});

observer.observe(chatArea,{

childList:true

});

/* ===========================================
   CONNECTION STATUS
=========================================== */

window.addEventListener("offline",()=>{

chatStatus.innerHTML="No Internet";

});

window.addEventListener("online",()=>{

chatStatus.innerHTML="Active";

});

/* ===========================================
   END OF CHAT.JS
=========================================== */
