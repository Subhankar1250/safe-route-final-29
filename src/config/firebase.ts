
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZCza9PikEqpLPv7bGfoEopwjP7A_Pt4s",
  authDomain: "school-bus-tracking-3924d.firebaseapp.com",
  projectId: "school-bus-tracking-3924d",
  storageBucket: "school-bus-tracking-3924d.firebasestorage.app",
  messagingSenderId: "306615080759",
  appId: "1:306615080759:web:c482bd3f632f81a1bcecb2",
  measurementId: "G-W1HFKY8CH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, analytics, firestore, auth, database };
