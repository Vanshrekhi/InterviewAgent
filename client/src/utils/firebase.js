
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-59785.firebaseapp.com",
  projectId: "interviewiq-59785",
  storageBucket: "interviewiq-59785.firebasestorage.app",
  messagingSenderId: "591270527759",
  appId: "1:591270527759:web:01b491186708a46f75347a"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}