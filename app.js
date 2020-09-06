// API URL
const API = "http://localhost:3000";

// Variables

let token;
let user_id;

// DOM selectors
const $register = $("#register");
const $login = $("#login");
const $feed = $("#feed");
const $showLogin = $("#show-login");
const $showRegister = $("#show-reg");
const $regBtn = $("#reg-btn");

async function home() {
  token = localStorage.getItem("token");
  if (token === null) {
    $feed.hide();
    $login.hide();
  } else {
    $login.hide();
    $register.hide();
    $feed.show();
  }
  // TODO - implement the feed
}

// Event listerns
$showLogin.on("click", (evt) => {
  evt.preventDefault();
  $register.hide();
  $login.show();
});

$showRegister.on("click", (evt) => {
  evt.preventDefault();
  $login.hide();
  $register.show();
});

$regBtn.on("click", async (evt) => {
  // Registers a new user.
  evt.preventDefault();
  const username = $("#username-reg").val();
  const password = $("#password-reg").val();
  const verify = $("#confirm-password").val();
  // Checks to make sure passwords match
  if (password !== verify) {
    console.log(e);
    $("#passwordHelp").text("Passwords must match!");
    $("#password-reg").val("");
    $("#confirm-password").val("");
  }
  // Verifies form data and tries to commit to db
  if (!username || !password || !verify) {
    $("#usernameHelp")
      .text("Username & Password is required!")
      .addClass("text-red");
  } else {
    //   Sends call to API
    try {
      const response = await axios.post(`${API}/api/users/register`, {
        username: username,
        password: password,
      });
      // Checks the response and updates the DOM
      if (response.data.message === "Success") {
        // Sets local storage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user_id", response.data.data.user.id);
        $("#password-reg").val("");
        $("#confirm-password").val("");
        $("#username-reg").val("");
        $register.hide();
        $feed.show();
      }
    } catch (e) {
      $("#usernameHelp").text("Username already taken, please try again");
      $("#username-reg").val("");
      $("#password-reg").val("");
      $("#confirm-password").val("");
    }
  }
});

home();
