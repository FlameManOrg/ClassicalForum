function closeError() {
  document.getElementById("error").classList.add("hidden");
}

function showError(msg) {
  document.getElementById("error").classList.remove("hidden");
  document.getElementById("errorMsg").textContent = msg;
}

function signUp() {
  let user = document.getElementById("signup-username").value;
  let pass = document.getElementById("signup-password").value;

  if (!user || !pass) return showError("Fill in all fields.");
  localStorage.setItem(user, pass);
  alert("Account created!");
  window.location.href = "login.html";
}

function logIn() {
  let user = document.getElementById("login-username").value;
  let pass = document.getElementById("login-password").value;

  if (localStorage.getItem(user) !== pass) return showError("Invalid login.");
  localStorage.setItem("loggedIn", "true");
  window.location.href = "home.html";
}

function checkScroll() {
  if (window.scrollY > 300) {
    document.getElementById("terminal").classList.remove("hidden");
  }
}
