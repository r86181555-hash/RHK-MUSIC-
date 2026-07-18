import { auth, db, onAuthStateChanged, collection, addDoc, query, orderBy, onSnapshot } from "./firebase.js";

let currentLoggedUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    } else {
        currentLoggedUser = user;
        initGlobalChatRoom();
    }
});

function initGlobalChatRoom() {
    const msgBox = document.getElementById("chat-messages-box");
    const q = query(collection(db, "global_messages"), orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        msgBox.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();
            const msgEl = document.createElement("div");
            msgEl.className = data.senderId === currentLoggedUser.uid ? "msg sent" : "msg received";
            msgEl.innerHTML = `<strong>${data.senderName || 'Anonymous'}:</strong> ${data.text}`;
            msgBox.appendChild(msgEl);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });
}

document.getElementById("chat-send-btn").addEventListener("click", sendMessage);
document.getElementById("chat-message-input").addEventListener("keypress", (e) => {
    if(e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const inputField = document.getElementById("chat-message-input");
    const messageText = inputField.value.trim();
    if(!messageText) return;

    inputField.value = "";
    await addDoc(collection(db, "global_messages"), {
        senderId: currentLoggedUser.uid,
        senderName: currentLoggedUser.email.split('@')[0],
        text: messageText,
        timestamp: Date.now()
    });
}
