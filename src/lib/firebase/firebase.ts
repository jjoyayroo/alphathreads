import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDgy5bM14RdfZaAQeT_Q-mEQm2Gx2BzoLI",
  authDomain: "alphathreads-8c1a9.firebaseapp.com",
  projectId: "alphathreads-8c1a9",
  storageBucket: "alphathreads-8c1a9.firebasestorage.app",
  messagingSenderId: "389563763530",
  appId: "1:389563763530:web:10e295ce2da01a1bb58fb3"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
