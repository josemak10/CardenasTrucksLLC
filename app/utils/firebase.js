import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB_BqXFnuFIh27iQyOYWAWCooxkYH0QHnU",
    authDomain: "transporting-1e7e7.firebaseapp.com",
    databaseURL: "https://transporting-1e7e7.firebaseio.com",
    projectId: "transporting-1e7e7",
    storageBucket: "transporting-1e7e7.appspot.com",
    messagingSenderId: "892208716443",
    appId: "1:892208716443:web:6c33904ef5131379dac43e"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);