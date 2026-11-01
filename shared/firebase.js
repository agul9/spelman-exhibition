import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6ivFEwpuosyjhrnt1F3LBd9MOE1D6-ow",
  authDomain: "spelman-exhibition.firebaseapp.com",
  projectId: "spelman-exhibition",
  storageBucket: "spelman-exhibition.firebasestorage.app",
  messagingSenderId: "417107696491",
  appId: "1:417107696491:web:0952630073e1e1a13dca2e",
  measurementId: "G-1KFSEB36RC",
  URL: "https://spelman-exhibition-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, onValue };