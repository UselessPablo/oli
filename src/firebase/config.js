// firebase/config.js - ESTÁ CORRECTO ASÍ
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3uvwJY05ooM-NUPx05RUUsuHZJFiMwjU",
  authDomain: "olivia-fdf8b.firebaseapp.com",
  projectId: "olivia-fdf8b",
  storageBucket: "olivia-fdf8b.firebasestorage.app",
  messagingSenderId: "305041040790",
  appId: "1:305041040790:web:692025ada53fe7e31c69b7",
  databaseURL: "https://olivia-fdf8b-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth }; // Solo exporta estas instancias