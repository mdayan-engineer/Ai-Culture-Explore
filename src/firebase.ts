import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app;
let auth;
let db;
let googleProvider;

export const initFirebase = async () => {
  if (app) return { app, auth, db, googleProvider };
  
  const response = await fetch('/api/firebase-config');
  const config = await response.json();
  
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app, config.firestoreDatabaseId);
  googleProvider = new GoogleAuthProvider();
  
  return { app, auth, db, googleProvider };
};

export const getFirebaseAuth = () => auth;
export const getFirebaseDb = () => db;
