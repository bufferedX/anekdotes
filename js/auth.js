import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';
import { createUserProfile } from './database-functions.js';

// Sign up new user
async function signUp(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await createUserProfile(user.uid, name, email);
    
    console.log('User signed up:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
}

// Sign in existing user
async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user.uid);
    return user;
  } catch (error) {
    console.error('Error signing in:', error.message);
    throw error;
  }
}

// Sign out
async function logOut() {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Check auth state
function checkAuthState(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user.uid);
      callback(user);
    } else {
      console.log('User is signed out');
      callback(null);
    }
  });
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}

export { signUp, signIn, logOut, checkAuthState, getCurrentUser };
