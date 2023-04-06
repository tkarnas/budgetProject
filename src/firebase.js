import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

//Mario DB config
//const firebaseConfig = {
//  apiKey: "AIzaSyCC5o5nInDpYdfHCcncmbPZuei_REV-YvY",
//  authDomain: "budgetapp-f87be.firebaseapp.com",
//  projectId: "budgetapp-f87be",
//  storageBucket: "budgetapp-f87be.appspot.com",
//  messagingSenderId: "508626969495",
//  appId: "1:508626969495:web:271ec7a9903319146d1ad2"
//};


//Tomo DB config
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
