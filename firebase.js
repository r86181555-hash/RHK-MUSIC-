import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
getStorage
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const firebaseConfig = {

apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",

authDomain: "rhk-app-e34c6.firebaseapp.com",

projectId: "rhk-app-e34c6",

storageBucket: "rhk-app-e34c6.firebasestorage.app",

messagingSenderId: "1016565109006",

appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",

measurementId: "G-814PTRRQVQ"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

export { app, db, storage };
