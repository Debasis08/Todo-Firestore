import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getToken } from 'firebase/messaging';
import { enableIndexedDbPersistence } from "firebase/firestore";
// import * as firebase from 'firebase/app';
// import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAL_XL-Ya338cmWk-0p77i4bgyoPtjR3Iw",
    authDomain: "todo-dec7b.firebaseapp.com",
    projectId: "todo-dec7b",
    storageBucket: "todo-dec7b.appspot.com",
    messagingSenderId: "523841133440",
    appId: "1:523841133440:web:dd17891bba2dc30d2c7f65",
    measurementId: "G-36QNXCBSLN"
  };

  enableIndexedDbPersistence(getFirestore(initializeApp(firebaseConfig)))
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
      } else if (err.code == 'unimplemented') {
          console.log("The current browser does not support all of the features required to enable persistence.");

      }
  });

  // firebase.firestore().settings({
  //   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  // });

  export const generateToken = async () => {
    const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      if (permission === 'granted') {
      const token = await getToken(messaging, { 
            vapidKey: 'BKuGdzsi2C3gm1hl17vGhO5YaCYv6xIwglsr6BF5_s9xX9DuoHBQgc3RSJ2Gt2QBdTt8DBAnZQWNjPKo5C9iR_Q'
          });
      console.log('Token:', token);
    }
  }
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);