import { auth, db, uploadToCloudinary, collection, addDoc, onAuthStateChanged } from "./firebase.js";

let userSession = null;
onAuthStateChanged(auth, (user) => { if (!user) window.location.href = "index.html"; else userSession = user; });

document.getElementById("upload-reel-btn").addEventListener("click", async () => {
    const videoFile = document.getElementById("reel-video-file").files[0];
    const desc = document.getElementById("reel-description").value;
    const btn = document.getElementById("upload-reel-btn");

    if(!videoFile) return alert("Please select a video file!");

    btn.disabled = true;
    btn.innerText = "Uploading high quality video to Cloudinary...";

    try {
        const videoUrl = await uploadToCloudinary(videoFile);
        
        await addDoc(collection(db, "reels"), {
            creatorId: userSession.uid,
            videoUrl: videoUrl,
            description: desc,
            timestamp: Date.now(),
            likes: [],
            views: 0
        });

        alert("Reel Live now!");
        window.location.href = "reels.html";
    } catch (err) {
        alert("Failed uploading reel: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "Publish Reel";
    }
});
