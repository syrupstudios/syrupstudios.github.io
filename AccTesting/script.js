import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
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
const emailSentContainer = document.getElementById("email-sent-container");
const loggedInContainer = document.getElementById("logged-in-container");

// Function to get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to update URL parameters
function updateUrlParameter(param, value) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(param, value);
  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}?${urlParams}`
  );
}

// Function to remove URL parameter
function removeUrlParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(param);
  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}?${urlParams}`
  );
}

// Set initial form based on URL parameter
window.onload = function () {
  const f = getUrlParameter("f_");
  const i = getUrlParameter("i_");
  const p = getUrlParameter("p_");

  if (!f) {
    updateUrlParameter("f_", "sign_up");
  }

  if (f === "sign_up") {
    container.classList.add("right-panel-active");
  } else if (f === "sign_in") {
    container.classList.remove("right-panel-active");
  }

  if (i === "reset_psw") {
    document.getElementById("forgotenpsw").style.display = "block";
  } else if (i === "email_sent") {
    const email = getUrlParameter("email");
    const action = getUrlParameter("action");
    const extraContent = getUrlParameter("ec_");
    if (email) {
      document.getElementById("email-address").textContent = email;
    }
    if (action) {
      document.getElementById("action").textContent = action;
    }
    if (extraContent) {
      document.getElementById("extraContent").textContent = " " + extraContent;
    }
    emailSentContainer.style.display = "block";
  }

  if (p === "home") {
    removeUrlParameter("p_");
  }

  setTimeout(function () {
    var elementToDelete = document.getElementById("loader");
    if (elementToDelete) {
      elementToDelete.remove();
    }
  }, 2500);
};

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
  updateUrlParameter("f_", "sign_up");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
  updateUrlParameter("f_", "sign_in");
});

// Login
document.getElementById("login-btn").addEventListener("click", function () {
  const loginEmail = document.getElementById("login-email").value;
  const loginPassword = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      document.getElementById("logged-in-email-address").textContent =
        loginEmail;
      loggedInContainer.style.display = "block";
      window.history.replaceState({}, document.title, window.location.pathname);
      updateUrlParameter("p_", "home");
      document.getElementById("error-login").innerHTML = "";
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById("error-login").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// Create account
document.getElementById("register-btn").addEventListener("click", function () {
  const registerEmail = document.getElementById("register-email").value;
  const registerPassword = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      document.getElementById("error-signup").innerHTML = "";

      sendEmailVerification(auth.currentUser).then(() => {
        updateUrlParameter("i_", "email_sent");
        updateUrlParameter("email", registerEmail);
        updateUrlParameter("action", "activate");
        document.getElementById("email-address").textContent = registerEmail;
        const action = getUrlParameter("action");
        document.getElementById("action").textContent = action;
        emailSentContainer.style.display = "block";
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById("error-signup").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// Show reset password popup
document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("forgotenpsw").style.display = "block";
  updateUrlParameter("i_", "reset_psw");
});

// Close reset password popup
document.getElementById("close-btn").addEventListener("click", function () {
  document.getElementById("forgotenpsw").style.display = "none";
  removeUrlParameter("i_");
});

// Reset password
document.getElementById("reset-psw-btn").addEventListener("click", function () {
  const emailToReset = document.getElementById("recovery-email").value;

  sendPasswordResetEmail(auth, emailToReset)
    .then(() => {
      // Hide the reset password popup
      document.getElementById("forgotenpsw").style.display = "none";

      // Update URL parameters
      updateUrlParameter("i_", "email_sent");
      updateUrlParameter("email", emailToReset);
      updateUrlParameter("action", "recover");
      updateUrlParameter(
        "ec_",
        "Still no email? You may not have an account so refresh and try again."
      );

      // Set the email and action text
      document.getElementById("email-address").textContent = emailToReset;
      const action = getUrlParameter("action");
      document.getElementById("action").textContent = action;

      // Get the extra content from URL parameter and set it
      const extraContent = getUrlParameter("ec_");
      if (extraContent) {
        document.getElementById("extraContent").textContent =
          " " + extraContent;
      }

      // Display the email sent container
      emailSentContainer.style.display = "block";
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById("error-reset").innerHTML =
        "Sorry! " + errorMessage;
    });
});

// Refresh button functionality
document.getElementById("refresh-btn").addEventListener("click", function () {
  // Remove all URL parameters
  window.history.replaceState({}, document.title, window.location.pathname);

  // Reload the page
  location.reload();
});

// logout
document.getElementById("log-out-btn").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      setTimeout(() => {
        document.location.reload();
      }, 500);
    })
    .catch((error) => {
      alert("Sorry! " + error.message);
    });
});
