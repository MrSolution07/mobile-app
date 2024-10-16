import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyAWl3Y7n5TifwjbdOZb3p5MK_zAyv8XCXo",
  authDomain: "metaway-68b26.firebaseapp.com",
  projectId: "metaway-68b26",
  storageBucket: "metaway-68b26.appspot.com", 
  messagingSenderId: "817642667283",
  appId: "1:817642667283:web:6acd4108c8a60576ad6ee6",
  measurementId: "G-D7TC076LGV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app); 
const storage = getStorage(app);

export { app, auth, db, storage, createUserWithEmailAndPassword, setDoc, doc };
