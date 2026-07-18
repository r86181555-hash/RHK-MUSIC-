import { auth, db, createUserWithEmailAndPassword, doc, setDoc } from "./firebase.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim().toLowerCase();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create User Document Profile in Firestore Database
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            username: username,
            email: email,
            bio: "Hello, I am using RHK!",
            profilePic: "https://placehold.co/150", 
            followers: [],
            following: []
        });

        window.location.href = "home.html";
    } catch (error) {
        alert("Signup Failed: " + error.message);
    }
});

