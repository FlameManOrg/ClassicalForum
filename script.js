// Import Firebase modules (adjust if using CDN or bundler)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDshvpsAN2oXfl6_0BNrzvwjKotJomB-hU",
  authDomain: "flame-fb774.firebaseapp.com",
  databaseURL: "https://flame-fb774-default-rtdb.firebaseio.com",
  projectId: "flame-fb774",
  storageBucket: "flame-fb774.firebasestorage.app",
  messagingSenderId: "959179533406",
  appId: "1:959179533406:web:5bd238c96eebb6c9db58cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Utility: Generate unique ID for friend system
function generateUniqueID() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// SIGNUP function
function signup(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user info in Realtime DB
      set(ref(db, 'users/' + user.uid), {
        username: username,
        email: email,
        role: "User",   // default role
        uniqueID: generateUniqueID()
      });

      alert("Signup successful! You can now login.");
      // Optionally redirect or clear form here
    })
    .catch((error) => {
      alert("Signup error: " + error.message);
    });
}

// LOGIN function
function login(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      // Optionally redirect or update UI here
    })
    .catch((error) => {
      alert("Login error: " + error.message);
    });
}

// LOGOUT function
function logout() {
  signOut(auth).then(() => {
    alert("Logged out.");
    // Optionally redirect or update UI here
  });
}

// Auth state listener - runs every time user logs in/out
onAuthStateChanged(auth, (user) => {
  const panelBtn = document.getElementById('panelButton');
  const loginBtn = document.getElementById('loginButton');
  const signupBtn = document.getElementById('signupButton');
  const settingsTab = document.getElementById('settingsTab');

  if (user) {
    // User is signed in — get user data
    get(ref(db, 'users/' + user.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const role = userData.role;

          // Show panel button for special roles
          if (role === "Developer" || role === "Administrator" || role === "Moderator") {
            panelBtn.style.display = "inline-block";
          } else {
            panelBtn.style.display = "none";
          }

          // Hide login/signup, show settings
          loginBtn.style.display = "none";
          signupBtn.style.display = "none";
          settingsTab.style.display = "inline-block";

        } else {
          console.log("User data not found in database.");
          panelBtn.style.display = "none";
          settingsTab.style.display = "none";
          loginBtn.style.display = "inline-block";
          signupBtn.style.display = "inline-block";
        }
      })
      .catch((error) => {
        console.error("Error reading user data:", error);
      });

  } else {
    // No user signed in — reset UI
    panelBtn.style.display = "none";
    settingsTab.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
  }
});

// You can connect these functions to your UI buttons/forms:

// Example:
// document.getElementById('signupForm').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = e.target.email.value;
//   const password = e.target.password.value;
//   const username = e.target.username.value;
//   signup(email, password, username);
// });

// document.getElementById('loginForm').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = e.target.email.value;
//   const password = e.target.password.value;
//   login(email, password);
// });

// document.getElementById('logoutBtn').addEventListener('click', () => {
//   logout();
// });
