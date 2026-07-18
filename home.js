import { auth, db, uploadToCloudinary, onAuthStateChanged, collection, addDoc, query, orderBy, onSnapshot, signOut } from "./firebase.js";

let currentUser = null;

// Auth Verification Layer
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        currentUser = user;
        loadTimeline();
    }
});

// Create Post Logic (Handles Text, Cloudinary Images, and Cloudinary Videos)
document.getElementById("submit-post-btn").addEventListener("click", async () => {
    const caption = document.getElementById("post-caption").value;
    const mediaFile = document.getElementById("post-media").files[0];
    const postBtn = document.getElementById("submit-post-btn");

    if (!caption && !mediaFile) return alert("Post cannot be completely empty!");
    
    postBtn.disabled = true;
    postBtn.innerText = "Publishing...";

    let mediaUrl = "";
    try {
        if (mediaFile) {
            mediaUrl = await uploadToCloudinary(mediaFile);
        }

        await addDoc(collection(db, "posts"), {
            uid: currentUser.uid,
            caption: caption,
            mediaUrl: mediaUrl,
            timestamp: Date.now(),
            likes: []
        });

        document.getElementById("post-caption").value = "";
        document.getElementById("post-media").value = "";
        alert("Published successfully!");
    } catch (err) {
        alert("Error creating post: " + err.message);
    } finally {
        postBtn.disabled = false;
        postBtn.innerText = "Post to RHK";
    }
});

// Live Feed Stream Render engine
function loadTimeline() {
    const feedContainer = document.getElementById("timeline-feed");
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        feedContainer.innerHTML = "";
        if(snapshot.empty) {
            feedContainer.innerHTML = "<p>No posts available yet. Be the first!</p>";
            return;
        }
        snapshot.forEach((doc) => {
            const post = doc.data();
            const postEl = document.createElement("div");
            postEl.className = "post-card";
            
            let mediaHtml = "";
            if (post.mediaUrl) {
                if (post.mediaUrl.includes("/video/upload")) {
                    mediaHtml = `<video src="${post.mediaUrl}" controls class="post-media"></video>`;
                } else {
                    mediaHtml = `<img src="${post.mediaUrl}" class="post-media"/>`;
                }
            }

            postEl.innerHTML = `
                <div class="post-header"><strong>User: ${post.uid.substring(0,6)}...</strong></div>
                <div class="post-body">
                    <p>${post.caption}</p>
                    ${mediaHtml}
                </div>
                <div class="post-footer">
                    <button class="like-btn">❤️ ${post.likes ? post.likes.length : 0} Likes</button>
                    <a href="comments.html?postId=${doc.id}" class="comment-link">💬 View Comments</a>
                </div>
            `;
            feedContainer.appendChild(postEl);
        });
    });
}

// Global Signout Action
document.getElementById("logout-btn").addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
});
