
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCp35MzmEzarRO7x_PmYFDgUP-4I61hcek",
  authDomain: "signal-5d669.firebaseapp.com",
  projectId: "signal-5d669",
  storageBucket: "signal-5d669.appspot.com",
  messagingSenderId: "966580459826",
  appId: "1:966580459826:web:64fc76f6fe687a24c95f2b",
  measurementId: "G-9MQ29VPS0M",
};

let app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};


