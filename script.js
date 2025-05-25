// --- Firebase SDK Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// --- Your Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyDshvpsAN2oXfl6_0BNrzvwjKotJomB-hU",
  authDomain: "flame-fb774.firebaseapp.com",
  databaseURL: "https://flame-fb774-default-rtdb.firebaseio.com",
  projectId: "flame-fb774",
  storageBucket: "flame-fb774.firebasestorage.app",
  messagingSenderId: "959179533406",
  appId: "1:959179533406:web:5bd238c96eebb6c9db58cf"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- Generate Unique ID ---
function generateUniqueID() {
  return Math.random().toString(36).substring(2, 10);
}

// --- Signup Handler ---
document.getElementById("signupBtn")?.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const username = document.getElementById("signupUsername").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uniqueID = generateUniqueID();

      // Save to database
      set(ref(db, 'users/' + user.uid), {
        email: email,
        username: username,
        uniqueID: uniqueID,
        friends: {}
      }).then(() => {
        alert("Signup successful!");
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      console.error(error);
      alert("Signup failed: " + error.message);
    });
});

// --- Login Handler ---
document.getElementById("loginBtn")?.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error(error);
      alert("Login failed: " + error.message);
    });
});

// --- Logout Handler ---
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Logged out.");
      window.location.href = "index.html";
    });
});

// --- Show Unique ID in Account Tab ---
function showAccountTab() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = ref(db, 'users/' + user.uid);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById("uniqueIDText").textContent = data.uniqueID;
      document.getElementById("accountTab").style.display = "block";
    } else {
      alert("User data not found.");
    }
  }).catch((error) => {
    console.error(error);
    alert("Failed to load account data.");
  });
}

// --- Auth UI Updates ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Hide login/signup, show settings
    document.getElementById("loginBtn")?.style.display = "none";
    document.getElementById("signupBtn")?.style.display = "none";
    document.getElementById("settingsIcon")?.style.display = "inline-block";
  }
});
