// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBVj5dxaW6oOrKOKCWR_3jdsJSBNK55_Bw",
    authDomain: "ai-component-playground.firebaseapp.com",
    projectId: "ai-component-playground",
    storageBucket: "ai-component-playground.firebasestorage.app",
    messagingSenderId: "881538429016",
    appId: "1:881538429016:web:b8afe7165db33b4ebe1a2d",
    measurementId: "G-S1P3KBBEYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);