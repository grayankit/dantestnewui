// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsoVUymo06as4LSONarABkxquGPSy-fxc",
  authDomain: "dantest-6b421.firebaseapp.com",
  databaseURL: "https://dantest-6b421-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dantest-6b421",
  storageBucket: "dantest-6b421.appspot.com",
  messagingSenderId: "895062222808",
  appId: "1:895062222808:web:517455d597f2cdb8a1f4ad",
  measurementId: "G-107HRHPPK3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const initFirebase = () => {
    return app
}