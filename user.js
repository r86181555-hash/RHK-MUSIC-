import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc,
collection,
query,
where,
onSnapshot,
arrayUnion,
arrayRemove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

const viewUser = localStorage.getItem("viewProfile");

if(!currentUser || !viewUser){

location.href="home.html";

}

const userDP=document.getElementById("userDP");

const topUsername=document.getElementById("topUsername");

const userName=document.getElementById("userName");

const userBio=document.getElementById("userBio");

const userPosts=document.getElementById("userPosts");

const userFollowers=document.getElementById("userFollowers");

const userFollowing=document.getElementById("userFollowing");

const userGrid=document.getElementById("userGrid");

const followBtn=document.getElementById("followBtn");

const messageBtn=document.getElementById("messageBtn");

/* ==========================
   LOAD USER PROFILE
========================== */

const userRef = doc(db,"users",viewUser);

onSnapshot(userRef,async(snapshot)=>{

if(!snapshot.exists()) return;

const user=snapshot.data();

userDP.src=user.dp || "defaultdp.png";

topUsername.innerHTML=user.username;

userName.innerHTML=user.username;

userBio.innerHTML=user.bio || "";

userFollowers.innerHTML=(user.followers||[]).length;

userFollowing.innerHTML=(user.following||[]).length;

const mySnap=await getDoc(doc(db,"users",currentUser));

const following=mySnap.data().following || [];

if(following.includes(viewUser)){

followBtn.innerHTML="Following";

}else{

followBtn.innerHTML="Follow";

}

});

/* ==========================
   LOAD POSTS
========================== */

const postQuery=query(

collection(db,"posts"),

where("username","==",viewUser)

);

onSnapshot(postQuery,(snapshot)=>{

userGrid.innerHTML="";

userPosts.innerHTML=snapshot.size;

snapshot.forEach((doc)=>{

const post=doc.data();

userGrid.innerHTML+=`

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
/* =====================================
   FOLLOW / UNFOLLOW
===================================== */

followBtn.onclick = async () => {

    const myRef = doc(db, "users", currentUser);
    const otherRef = doc(db, "users", viewUser);

    const mySnap = await getDoc(myRef);

    if (!mySnap.exists()) return;

    const following = mySnap.data().following || [];

    if (following.includes(viewUser)) {

        await updateDoc(myRef, {
            following: arrayRemove(viewUser)
        });

        await updateDoc(otherRef, {
            followers: arrayRemove(currentUser)
        });

        followBtn.innerHTML = "Follow";

    } else {

        await updateDoc(myRef, {
            following: arrayUnion(viewUser)
        });

        await updateDoc(otherRef, {
            followers: arrayUnion(currentUser)
        });

        followBtn.innerHTML = "Following";

    }

};

/* =====================================
   MESSAGE BUTTON
===================================== */

messageBtn.onclick = () => {

    localStorage.setItem("chatUser", viewUser);

    location.href = "messages.html";

};

/* =====================================
   OPEN POST
===================================== */

window.openPost = function(postId){

    localStorage.setItem("viewPost", postId);

    location.href = "post.html";

};

/* =====================================
   SHARE PROFILE
===================================== */

window.shareProfile = async function(){

    const profileUrl =
        window.location.origin +
        "/user.html?user=" +
        viewUser;

    if(navigator.share){

        await navigator.share({

            title: viewUser,

            text: "Check out this RHK profile",

            url: profileUrl

        });

    }else{

        navigator.clipboard.writeText(profileUrl);

        alert("Profile link copied");

    }

};

/* =====================================
   VIEW STORY
===================================== */

window.viewUserStory = function(){

    localStorage.setItem("storyUser", viewUser);

    location.href = "storyview.html";

};
