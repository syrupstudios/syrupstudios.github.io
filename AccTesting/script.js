import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const apiKey = window.API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "syrupstudiosaccounts-e87b0.firebaseapp.com",
  databaseURL: "https://syrupstudiosaccounts-e87b0-default-rtdb.firebaseio.com",
  projectId: "syrupstudiosaccounts-e87b0",
  storageBucket: "syrupstudiosaccounts-e87b0.appspot.com",
  messagingSenderId: "722905621699",
  appId: "1:722905621699:web:265260ccbc2b0bd2552e76",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

//loading screen
window.onload = function () {
  setTimeout(function () {
    var elementToDelete = document.getElementById("loader");
    if (elementToDelete) {
      elementToDelete.remove();
    }
  }, 2500);
};

// login
document.getElementById("login-btn").addEventListener("click", function () {
  const loginEmail = document.getElementById("login-email").value;
  const loginPassword = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      // signed in
      const user = userCredential.user;
      alert("Welcome back! " + loginEmail);
      document.getElementById("error-login").innerHTML = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("error-login").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// create account
document.getElementById("register-btn").addEventListener("click", function () {
  const registerEmail = document.getElementById("register-email").value;
  const registerPassword = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredential) => {
      // signed in
      const user = userCredential.user;
      alert("Welcome! " + registerEmail);
      document.getElementById("error-signup").innerHTML = "";

      sendEmailVerification(auth.currentUser).then(() => {
        console.log("Email Verification Sent!");
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("error-signup").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// reset password
document.getElementById("reset-btn").addEventListener("click", function () {
  const emailToReset = document.getElementById("login-email").value;

  sendPasswordResetEmail(auth, emailToReset)
    .then(() => {
      alert("Password reset email sent!");
      document.getElementById("error-login").innerHTML = "";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("error-login").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// logout
/*document.getElementById('log-out-btn').addEventListener('click', function(){
    signOut(auth).then(() => {
        document.location.reload();
    }).catch((error) => {
        document.getElementById('result').innerHTML= "Sorry! " + error.message;
    });
});
*/
