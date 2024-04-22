/* // firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics"; */

const firebaseConfig = {
  apiKey: "AIzaSyAAbxRxOvvtwYLvHAr7qlBFzilK9wLOBkU",
  authDomain: "nutriconti-8b41e.firebaseapp.com",
  projectId: "nutriconti-8b41e",
  storageBucket: "nutriconti-8b41e.appspot.com",
  messagingSenderId: "459133191055",
  appId: "1:459133191055:web:cf7580218652c50f8f81fa",
  measurementId: "G-RVP78QK25H"
};

// Initialize Firebase
/* export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app); */
export default firebaseConfig;