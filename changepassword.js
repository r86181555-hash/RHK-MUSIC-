import { db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const currentUser = localStorage.getItem("RHKUser");

if(!currentUser){

location.href="index.html";

}

const oldPassword=document.getElementById("oldPassword");
const newPassword=document.getElementById("newPassword");
const confirmPassword=document.getElementById("confirmPassword");

const savePassword=document.getElementById("savePassword");
const status=document.getElementById("status");

/* ==========================================
   CHANGE PASSWORD
========================================== */

savePassword.onclick=async()=>{

const oldPass=oldPassword.value.trim();
const newPass=newPassword.value.trim();
const confirmPass=confirmPassword.value.trim();

if(oldPass=="" || newPass=="" || confirmPass==""){

status.style.color="red";
status.innerHTML="Please fill all fields.";

return;

}

if(newPass!==confirmPass){

status.style.color="red";
status.innerHTML="Passwords do not match.";

return;

}

try{

const ref=doc(db,"users",currentUser);

const snap=await getDoc(ref);

if(!snap.exists()){

status.style.color="red";
status.innerHTML="User not found.";

return;

}

const data=snap.data();

if(data.password!==oldPass){

status.style.color="red";
status.innerHTML="Current password is incorrect.";

return;

}

await updateDoc(ref,{

password:newPass

});

status.style.color="lime";

status.innerHTML="Password changed successfully.";

oldPassword.value="";
newPassword.value="";
confirmPassword.value="";

setTimeout(()=>{

location.href="settings.html";

},1200);

}catch(e){

status.style.color="red";
status.innerHTML="Failed to change password.";

}

};
