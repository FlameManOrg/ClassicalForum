// Import Firebase modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Initialize Firebase Auth and Database
const auth = getAuth();
const db = getDatabase();

// Get references to your UI buttons by their IDs
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const settingsBtn = document.getElementById("settingsBtn");
const panelBtn = document.getElementById("panelBtn");

// Listen to authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is logged in: Hide login and signup buttons
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";

    // Show settings button
    settingsBtn.style.display = "inline-block";

    // Fetch user role from Realtime Database
    try {
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        const role = userData.role || "User";

        // Show panel button only for special roles
        if (role === "Developer" || role === "Administrator" || role === "Moderator") {
          panelBtn.style.display = "inline-block";
        } else {
          panelBtn.style.display = "none";
        }
      } else {
        // No user data found - hide panel button
        panelBtn.style.display = "none";
      }
    } catch (error) {
      console.error("Failed to get user role:", error);
      panelBtn.style.display = "none";
    }

  } else {
    // User is logged out: Show login/signup, hide settings and panel
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    settingsBtn.style.display = "none";
    panelBtn.style.display = "none";
  }
});
