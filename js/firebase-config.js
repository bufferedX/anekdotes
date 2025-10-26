// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, deleteDoc, increment, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsW1yc6XIM31x9QlHg14EaadJUl3rj9ho",
  authDomain: "anek-dotes.firebaseapp.com",
  projectId: "anek-dotes",
  storageBucket: "anek-dotes.firebasestorage.app",
  messagingSenderId: "791103418649",
  appId: "1:791103418649:web:7e258203b972816f7bd588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other files
export { db, auth, collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc, deleteDoc, increment, serverTimestamp, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };