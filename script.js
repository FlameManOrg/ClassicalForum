// Firebase config (replace with yours)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Sign up logic
function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const roles = {
    "developer@cf.com": "Developer",
    "admin@cf.com": "Administrator",
    "mod@cf.com": "Moderator"
  };

  const userRole = roles[email] || "User";

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      db.ref("users/" + uid).set({ email, role: userRole });
      alert("Account created!");
      window.location.href = "index.html";
    })
    .catch(error => alert("Signup Error: " + error.message));
}

// Login logic
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logged in!");
      window.location.href = "index.html";
    })
    .catch(error => alert("Login Error: " + error.message));
}

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    db.ref("users/" + user.uid).once("value").then(snapshot => {
      const role = snapshot.val()?.role || "User";
      document.getElementById("loginBtn")?.remove();
      document.getElementById("signupBtn")?.remove();
      document.getElementById("settingsBtn")?.style.display = "block";

      const panelBtn = document.getElementById("panelBtn");
      if (panelBtn) {
        if (role === "Developer") {
          panelBtn.textContent = "Developer Panel";
          panelBtn.onclick = () => location.href = "developer.html";
        } else if (role === "Administrator") {
          panelBtn.textContent = "Admin Panel";
          panelBtn.onclick = () => location.href = "admin.html";
        } else if (role === "Moderator") {
          panelBtn.textContent = "Mod Panel";
          panelBtn.onclick = () => location.href = "mod.html";
        }
        panelBtn.style.display = "inline";
      }

      document.getElementById("forumsBtn").onclick = () => {
        location.href = "forum.html";
      };
    });
  } else {
    document.getElementById("forumsBtn").onclick = () => {
      location.href = "login.html";
    };
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  auth.signOut().then(() => location.href = "index.html");
});

// Chat logic
function sendMessage() {
  const user = auth.currentUser;
  if (!user) return alert("Login first!");
  const message = document.getElementById("messageInput").value;
  db.ref("messages").push({ user: user.email, text: message });
  document.getElementById("messageInput").value = "";
}

const chatBox = document.getElementById("chatBox");
if (chatBox) {
  db.ref("messages").on("child_added", snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${msg.user}: ${msg.text}`;
    chatBox.appendChild(div);
  });
}
