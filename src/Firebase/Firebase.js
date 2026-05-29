// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtiMjJUe6_ElehNh9am1UvFp-S3QMB3iM",
  authDomain: "sumak-d6728.firebaseapp.com",
  projectId: "sumak-d6728",
  storageBucket: "sumak-d6728.firebasestorage.app",
  messagingSenderId: "131275918407",
  appId: "1:131275918407:web:65ba84611c3e4474d57562",
  measurementId: "G-QC6D87S0C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  
   export const db = getFirestore(app);  