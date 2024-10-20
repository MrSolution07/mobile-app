import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID,
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
    } from '@env' ;

    const firebaseConfig = {
      apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: EXPO_PUBLIC_FIREBASE_APP_ID,
      measurementId: EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app); 
const storage = getStorage(app);

export { app, auth, db, storage, createUserWithEmailAndPassword, setDoc, doc };
