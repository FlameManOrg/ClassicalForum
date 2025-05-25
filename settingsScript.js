import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const auth = getAuth();
const db = getDatabase();

const userIdSpan = document.getElementById("userId");
const accountSection = document.getElementById("accountSection");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    accountSection.style.display = "block";

    try {
      const snapshot = await get(ref(db, "users/" + user.uid));
      if (snapshot.exists()) {
        const uniqueID = snapshot.val().uniqueID || user.uid.slice(0, 6).toUpperCase();
        userIdSpan.textContent = uniqueID;
      } else {
        userIdSpan.textContent = user.uid.slice(0, 6).toUpperCase();
      }
    } catch (error) {
      console.error("Error fetching unique ID:", error);
      userIdSpan.textContent = user.uid.slice(0, 6).toUpperCase();
    }
  } else {
    accountSection.style.display = "none";
    userIdSpan.textContent = "";
  }
});

logoutBtn.addEvent
