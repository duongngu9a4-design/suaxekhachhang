// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyChSluavuaix4-Hd2wi8WOIHeKsRBQ_nFc",
    authDomain: "suaxekhachhang.firebaseapp.com",
    projectId: "suaxekhachhang",
    storageBucket: "suaxekhachhang.appspot.com",
    messagingSenderId: "634408914185",
    appId: "1:634408914185:web:4d225de202691a3c82d7d8",
    measurementId: "G-4XNJKGL19H"
  };


  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  export {auth,db}