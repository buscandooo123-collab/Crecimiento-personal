import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfrsG0FreWxoGSLMtTTol0raK45nsmglE",
  authDomain: "crecimiento-personal-3e72d.firebaseapp.com",
  projectId: "crecimiento-personal-3e72d",
  storageBucket: "crecimiento-personal-3e72d.firebasestorage.app",
  messagingSenderId: "748066493575",
  appId: "1:748066493575:web:b5da1556caca9f7235d422"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
