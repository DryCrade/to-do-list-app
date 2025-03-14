import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIDiOLsfBxSqwSF4VV29R4pkqMBj8t_ww",
  authDomain: "to-do-list-app-ffa0d.firebaseapp.com",
  projectId: "to-do-list-app-ffa0d",
  storageBucket: "to-do-list-app-ffa0d.firebasestorage.app",
  messagingSenderId: "267422857077",
  appId: "1:267422857077:web:13cc8bd9f753544602c53c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };