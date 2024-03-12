// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCpnQ-qfPy02mZf4IoCwVMg_2qVO9tGxZE',
  authDomain: 'scrumdiddly-97efe.firebaseapp.com',
  projectId: 'scrumdiddly-97efe',
  storageBucket: 'scrumdiddly-97efe.appspot.com',
  messagingSenderId: '120561922431',
  appId: '1:120561922431:web:446a179af2dfa7e32eaa4a',
  measurementId: 'G-8PYR6QD0S6'
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
