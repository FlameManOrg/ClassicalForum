import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const auth = getAuth();
const db = getDatabase();

const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const email = form.email.value.trim();
  const password = form.password.value;
  const username = form.username.value.trim();

  if (!username) {
    errorMsg.textContent = "Username is required.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update displayName
    await updateProfile(user, { displayName: username });

    // Save user data in Realtime Database
    await set(ref(db, "users/" + user.uid), {
      username: username,
      email: email,
      role: "User",  // Default role
      uniqueID: user.uid.slice(0, 6).toUpperCase() // example unique ID
    });

    window.location.href = "index.html";

  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
