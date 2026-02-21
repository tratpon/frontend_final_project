// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd64ki3K5dItVz_C1Bs73TutmMYCwffpw",
  authDomain: "finalproject-ea988.firebaseapp.com",
  projectId: "finalproject-ea988",
  storageBucket: "finalproject-ea988.firebasestorage.app",
  messagingSenderId: "613875850345",
  appId: "1:613875850345:web:45fd5fbfd7ac0b5468d6f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);