import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCRPyd-Um-UN9rxUIt9XW8bDcTBz0xMX40",
  authDomain: "airesumebuilder-60f9e.firebaseapp.com",
  projectId: "airesumebuilder-60f9e",
  storageBucket: "airesumebuilder-60f9e.firebasestorage.app",
  messagingSenderId: "765427554416",
  appId: "1:765427554416:web:48edaa1685f6d1e8577cb5",
  measurementId: "G-8HW9NGZ26Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
