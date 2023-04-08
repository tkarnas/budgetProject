import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

  const firebaseConfig = {
   apiKey: "AIzaSyCwb3gB8q9kP5PLD8zb5cv7MtXx44KKSis",
   authDomain: "trackmyprojectbudget.firebaseapp.com",
   projectId: "trackmyprojectbudget",
   storageBucket: "trackmyprojectbudget.appspot.com",
   messagingSenderId: "1072402713274",
   appId: "1:1072402713274:web:7d899e132f326211aa1083"
  };

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

export { firebase, db };
