import { db } from "./firebase.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ===========================
   LOGIN
=========================== */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

loginBtn.onclick = async () => {

const username = document.getElementById("loginUsername").value.trim();

const password = document.getElementById("loginPassword").value.trim();

const msg = document.getElementById("loginMessage");

if (!username || !password) {

msg.innerHTML = "Enter username and password";

return;

}

try {

const snap = await getDoc(doc(db, "users", username));

if (!snap.exists()) {

msg.innerHTML = "User not found";

return;

}

const data = snap.data();

if (data.password !== password) {

msg.innerHTML = "Wrong password";

return;

}

localStorage.setItem("RHKUser", username);
localStorage.setItem("userDP", data.dp || "");
localStorage.setItem("username", username);

window.location.href = "home.html";

} catch (e) {

console.log(e);

msg.innerHTML = "Login failed";

}

};

}

/* ===========================
   SIGN UP
=========================== */

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {

signupBtn.onclick = async () => {

const username = document.getElementById("signupUsername").value.trim();

const password = document.getElementById("signupPassword").value.trim();

const msg = document.getElementById("signupMessage");

if (!username || !password) {

msg.innerHTML = "Fill all fields";

return;

}

try {

const ref = doc(db, "users", username);

const snap = await getDoc(ref);

if (snap.exists()) {

msg.innerHTML = "Username already exists";

return;

}

await setDoc(ref, {

username: username,

password: password,

name: username,

bio: "",

dp: "",

followers: [],

following: [],

createdAt: Date.now()

});

msg.innerHTML = "Account created successfully";

setTimeout(() => {

window.location.href = "index.html";

}, 1000);

} catch (e) {

console.log(e);

msg.innerHTML = "Signup failed";

}

};

}
