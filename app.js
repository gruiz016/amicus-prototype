// API URL
const API = "https://amicus-server.herokuapp.com";

// Variables
let reader = new FileReader();
let imagebase64;

// DOM selectors
const $register = $("#register");
const $login = $("#login");
const $feed = $("#feed");
const $showLogin = $("#show-login");
const $showRegister = $("#show-reg");
const $regBtn = $("#reg-btn");
const $logBtn = $("#log-btn");
const $createComment = $("#createComment");

$('.spinner').hide()

// Helps convert images to base64
function encodeImageFileAsURL(element) {
  const file = element.files[0];
  reader.onloadend = function () {
    imagebase64 = reader.result;
  }
  reader.readAsDataURL(file);
}

// Loads everytime the home screen refresh.
async function home() {
  token = localStorage.getItem("token");
  if (token === null) {
    $feed.hide();
    $login.hide();
    $(".nav-link").toggleClass("disabled");
  } else {
    $login.hide();
    $register.hide();
    $feed.show();
  }
  await getPhotoFeed();
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

$createComment.on("click", (evt) => {
  evt.preventDefault();
  $("#collapseComments").hide();
  $write.show();
});

$regBtn.on("click", async (evt) => {
  // Registers a new user.
  evt.preventDefault();
  const username = $("#username-reg").val();
  const password = $("#password-reg").val();
  const verify = $("#confirm-password").val();
  // Checks to make sure passwords match
  if (password !== verify) {
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
        $("#password-reg").val("");
        $("#confirm-password").val("");
        $("#username-reg").val("");
        $register.hide();
        $feed.show();
        $(".nav-link").toggleClass("disabled");
      }
    } catch (e) {
      $("#usernameHelp").text("Username already taken, please try again");
      $("#username-reg").val("");
      $("#password-reg").val("");
      $("#confirm-password").val("");
    }
  }
});

$logBtn.on("click", async (evt) => {
  // Logs a user in.
  evt.preventDefault();
  const username = $("#username-log").val();
  const password = $("#password-log").val();
  // Checks if user inputs values.
  if (!username || !password) {
    $("#username-logHelp").text("Username/Password is required!");
  }
  try {
    // Sends the request to login.
    const response = await axios.post(`${API}/api/users/login`, {
      username: username,
      password: password,
    });
    if (response.data.message === "Authenticated") {
      // Sets local storage
      localStorage.setItem("token", response.data.data.token);
      $("#username-log").val("");
      $("#password-log").val("");
      $login.hide();
      $feed.show();
      $(".nav-link").toggleClass("disabled");
    }
  } catch (e) {
    $("#username-logHelp").text(
      "Username/Password is incorrect, please try again!"
    );
    $("#username-log").val("");
    $("#password-log").val("");
  }
});

async function getPhotoFeed() {
  try {
    $('.spinner').show()
    const response = await axios.get(`${API}/api/pictures`);
    response.data.data.pictures.forEach(async (p) => {
      const user = await axios.get(`${API}/api/users/${p.user_id}`);
      const likes = await axios.get(`${API}/api/likes/picture/${p.id}`);
      const $item = `
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 card border p-2 my-2">
          <div class="row align-items-center" id="profile-info">
            <div class="col-3 col-md-2">
              <img
                src="${user.data.data.user.profile_picture_url}"
                alt="User profile ${user.data.data.user.username} picture"
                class="user-photo rounded-circle"
              />
            </div>
            <div class="col-9 col-md-10">
              <h2>${user.data.data.user.username}</h2>
            </div>
          </div>
          <div class="row my-3" id="picture">
            <div class="col">
            <button class="pic-btn" id="userPhoto">
              <img src="${p.picture_url}" alt="User ${user.data.data.user.username} picture" class="post-picture rounded" data-id="${p.id}"/>
            </button>
            </div>
          </div>
          <div class="row" id="actions">
            <div class="col-6">
              <button
                class="pic-btn"
                type="button"
                data-toggle="collapse"
                data-target="#collapseLikes${p.id}"
                aria-expanded="false"
                aria-controls="collapseLikes"
                id="like${p.id}"
              >
              </button>
              <button class="pic-btn" type="button" data-toggle="collapse" data-target="#collapseComments${p.id}"
              aria-expanded="false" aria-controls="collapseComments">
              <i class="far fa-comments"></i>
            </button>
            </div>
          </div>
          <div class="collapse" id="collapseComments${p.id}"></div>
          <div class="collapse" id="collapseLikes${p.id}">
            <div class="row justify-content-center align-items-center">
              <div class="col">
                <p class="likes">${likes.data.data.count} Likes</p>
              </div>
            </div>
          </div>
          <div class="row my-2" id="write">
          <div class="col">
            <form>
              <div class="form-group">
                <label for="comment">Comment</label>
                <input type="text" class="form-control" id="comment${p.id}" aria-describedby="commentHelp">
              </div>
              <button type="submit" class="btn btn-primary my-1" id="cmt-submit" data-id="${p.id}">Submit</button>
            </form>
          </div>
        </div>
        </div>
      </div>`;
      $feed.append($item);
      // Checks if user liked photo previously
      const answer = await axios.patch(`${API}/api/likes/check/${p.id}`, {
        _token: token,
      });
      if (answer.data.data.answer === 0) {
        $(`#like${p.id}`).append('<i class="far fa-heart"></i>')
      } else {
        $(`#like${p.id}`).append('<i class="fas fa-heart"></i>')
      }
      // Creates and adds comments to the item above
      const comments = await axios.get(`${API}/api/comments/picture/${p.id}`);
      comments.data.data.comments.forEach(async (c) => {
        const user = await axios.get(`${API}/api/users/${c.user_id}`);
        const $comment = `
        <div class="comments border rounded my-2">
          <div class="row border-bottom p-1 mt-1 align-items-center rounded">
            <div class="col-2 col-md-1">
              <img
                src="${user.data.data.user.profile_picture_url}" alt="User profile ${user.data.data.user.username} picture" class="comment-pic rounded-circle"/>
            </div>
            <div class="col-8 col-md-10 comment-post">
              <p>${c.comment}</p>
              <p class="small">${c.comment_date}</p>
            </div>
          </div>
        </div>`;
        $(`#collapseComments${p.id}`).append($comment);
      });
    });
    $('.spinner').hide()
  } catch (e) {
    $("#alert")
      .text("Opppps... Something went wrong")
      .addClass("alert-danger")
      .addClass("text-center");
  }
}

$("body").on("click", "#cmt-submit", async (evt) => {
  // Adds a commit from a user
  evt.preventDefault();
  const token = localStorage.getItem("token");
  const photoId = $(evt.target).attr("data-id");
  const comment = $(`#comment${photoId}`).val();
  try {
    if (!comment) return;
    await axios.post(`${API}/api/comments/`, {
      _token: token,
      data: {
        comment,
        picture_id: +photoId,
      },
    });
    $(`#comment${photoId}`).val("");
    $(`#collapseComments${photoId}`).text("");
    // Creates and adds comments to the current comments
    const comments = await axios.get(`${API}/api/comments/picture/${photoId}`);
    comments.data.data.comments.forEach(async (c) => {
      const user = await axios.get(`${API}/api/users/${c.user_id}`);
      const $comment = `
      <div class="comments border rounded my-2">
        <div class="row border-bottom p-1 mt-1 align-items-center rounded">
          <div class="col-2 col-md-1">
            <img
              src="${user.data.data.user.profile_picture_url}" alt="User profile ${user.data.data.user.username} picture" class="comment-pic rounded-circle"/>
          </div>
          <div class="col-8 col-md-10 comment-post">
            <p>${c.comment}</p>
            <p class="small">${c.comment_date}</p>
          </div>
        </div>
      </div>`;
      $(`#collapseComments${photoId}`).append($comment);
    });
  } catch (e) {
    $("#alert")
      .text("Opppps... Something went wrong")
      .addClass("alert-danger")
      .addClass("text-center");
  }
});

$("body").on("dblclick", "#userPhoto", async (evt) => {
  // Adds a like to a photo
  evt.preventDefault();
  const token = localStorage.getItem("token");
  const photoId = $(evt.target).attr("data-id");
  try {
    // Checks if user likes photo already.
    const answer = await axios.patch(`${API}/api/likes/check/${photoId}`, {
      _token: token,
    });
    if (answer.data.data.answer === 0) {
      // Sends request to like the post if the answer is no
      await axios.post(`${API}/api/likes`, {
        _token: token,
        data: {
          picture_id: +photoId,
        },
      });
      const likes = await axios.get(`${API}/api/likes/picture/${photoId}`);
      $(`#collapseLikes${photoId}`).text("");
      $likes = `
          <div class="row justify-content-center align-items-center">
            <div class="col">
              <p class="likes">${likes.data.data.count} Likes</p>
            </div>
          </div>`;
      $(`#collapseLikes${photoId}`).append($likes);
      $(`#like${photoId}`).text("");
      $(`#like${photoId}`).append('<i class="fas fa-heart"></i>');
    } else {
      await axios.patch(`${API}/api/likes/${photoId}`, {
        _token: token,
      });
      const likes = await axios.get(`${API}/api/likes/picture/${photoId}`);
      $(`#collapseLikes${photoId}`).text("");
      $likes = `
          <div class="row justify-content-center align-items-center">
            <div class="col">
              <p class="likes">${likes.data.data.count} Likes</p>
            </div>
          </div>`;
      $(`#collapseLikes${photoId}`).append($likes);
      $(`#like${photoId}`).text("");
      $(`#like${photoId}`).append('<i class="far fa-heart"></i>');
    }
  } catch (e) {
    $("#alert")
      .text("Opppps... Something went wrong")
      .addClass("alert-danger")
      .addClass("text-center");
  }
});

home();