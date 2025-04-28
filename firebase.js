// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC3WwxamAscg_uK1b4y_buannwRJyG3Mk",
  authDomain: "pickuptruckapp.firebaseapp.com",
  projectId: "pickuptruckapp",
  storageBucket: "pickuptruckapp.appspot.com",
  messagingSenderId: "843958766652",
  appId: "1:843958766652:web:5efa2599441df2ba380739",
  measurementId: "G-QJWM3B1Y5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Connect to emulators in development if using them
if (__DEV__) {
  try {
    // Uncomment these lines if you are using Firebase emulators
    // connectAuthEmulator(auth, "http://localhost:9099");
    // connectFirestoreEmulator(db, "localhost", 8080);
    // connectStorageEmulator(storage, "localhost", 9199);
    console.log("Connected to Firebase");
  } catch (error) {
    console.log("Failed to connect to Firebase", error);
  }
}

export { app, auth, db, storage, analytics };