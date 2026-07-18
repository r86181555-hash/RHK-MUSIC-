import { db } from "./firebase.js";

import {
collection,
query,
where,
onSnapshot,
doc,
updateDoc,
arrayRemove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const savedGrid = document.getElementById("savedGrid");

/* ==========================================
   LOAD SAVED POSTS
========================================== */

const q = query(

collection(db,"posts"),

where("savedBy","array-contains",currentUser)

);

onSnapshot(q,(snapshot)=>{

savedGrid.innerHTML="";

if(snapshot.empty){

savedGrid.innerHTML=`

<div style="
padding:60px;
text-align:center;
color:#888;
width:100%;
">

<h3>No Saved Posts</h3>

<p>Posts you save will appear here.</p>

</div>

`;

return;

}

snapshot.forEach((document)=>{

const post=document.data();

savedGrid.innerHTML+=`

<div class="profilePost"

onclick="openPost('${document.id}')">

<img

src="${post.image}"

>

<div class="postOverlay">

<i class="fa-solid fa-heart"></i>

${post.likes || 0}

&nbsp;&nbsp;

<i class="fa-solid fa-comment"></i>

${post.comments || 0}

</div>

<button

class="unsaveBtn"

onclick="event.stopPropagation();unsavePost('${document.id}')">

<i class="fa-solid fa-bookmark"></i>

</button>

</div>

`;

});

});

/* ==========================================
   UNSAVE POST
========================================== */

window.unsavePost = async(postId)=>{

await updateDoc(

doc(db,"posts",postId),

{

savedBy:arrayRemove(currentUser)

}

);

};

/* ==========================================
   OPEN POST
========================================== */

window.openPost=(postId)=>{

localStorage.setItem("postId",postId);

location.href="post.html";

};
