$('.spinner').hide()

const userProfile = async () => {
    $('.spinner').show()
    const token = localStorage.getItem("token");
    try {
        const user = await axios.get(`${API}/api/users/profile/${token}`);
        const likes = await axios.get(`${API}/api/likes/user/${token}`);
        const comments = await axios.get(`${API}/api/comments/${token}`);
        const pictures = await axios.get(`${API}/api/pictures/user/${token}`);
        const $profile = `
        <div class="col-12 col-md-10">
            <div class="row align-items-center">
                <div class="col-4 col-md-2" id="userPicture">
                <button class="pic-btn" data-toggle="collapse" data-target="#collapseImage" aria-expanded="false" aria-controls="collapseImage"> 
                    <img src="${user.data.data.user.profile_picture_url}" alt="User profile picture"
                        class="profile-pic rounded-circle" />
                </button>
                <div class="col collapse" id="collapseImage">
                    <div class="card card-body">
                        <input type="file" id="photo" onchange="encodeImageFileAsURL(this)">
                        <button type="submit" class="btn btn-primary my-1" id="pic-submit">Submit</button>
                    </div>
                </div>
                </div>
                <div class="col-4 col-md-6" id="userInfo">
                    <h3>@${user.data.data.user.username}</h3>
                    <p>Bio: ${user.data.data.user.about}</p>
                </div>
                <div class="col-4 col-md-2">
                    <button class="btn-primary my-2" id="edt-btn" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Edit</button>
                    <button class="btn-danger my-2" id="lg-btn">Logout</button>
                </div>
                <div class="collapse col-12" id="collapseExample">
                    <div class="card card-body p-2">
                        <form>
                            <div class="form-group my-1">
                                <label for="firstName">First Name</label>
                                <input type="text" class="form-control" id="firstName" placeholder="${user.data.data.user.first_name}">
                            </div>
                            <div class="form-group my-1">
                                <label for="lastName">Last Name</label>
                                <input type="text" class="form-control" id="lastName" placeholder="${user.data.data.user.last_name}">
                            </div>
                            <div class="form-group my-1">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" placeholder="${user.data.data.user.email}">
                            </div>
                            <div class="form-group my-1">
                                <label for="about">Bio</label>
                                <input type="text" class="form-control" id="about" placeholder="${user.data.data.user.about}">
                            </div>
                            <button type="submit" class="btn btn-primary my-1" id="edt-submit">Submit</button>
                    </form>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center align-items-center my-2 mx-1" id="userData">
                <div class="col-4 border">
                    <p class="text-center">Likes</p>
                    <p class="text-center">${likes.data.data.count}</p>
                </div>
                <div class="col-4 border">
                    <p class="text-center">Comments</p>
                    <p class="text-center">${comments.data.data.count}</p>
                </div>
                <div class="col-4 border">
                    <p class="text-center">Photos</p>
                    <p class="text-center">${pictures.data.data.pictures.length}</p>
                </div>
            </div>
            <div class="row myPhotos"></div>
        </div>`;
        $("#user").append($profile);
        // Gets picture data and adds it to the card
        pictures.data.data.pictures.map(async (p) => {
            const likes = await axios.get(`${API}/api/likes/picture/${p.id}`);
            const comments = await axios.get(`${API}/api/comments/picture/${p.id}`);
            $pic = `
            <div class="col-12 col-md-4">
                <div class="card">
                    <img src="${p.picture_url}" class="card-img-top user-photo"
                        alt="${user.data.data.user.username} photo id ${p.id}" />
                    <div class="card-body">
                        <div class="row">
                            <div class="col-4">
                                <p class="text-center">Likes</p>
                                <p class="text-center">${likes.data.data.count}</p>
                            </div>
                            <div class="col-6">
                                <p class="text-center">Comments</p>
                                <p class="text-center">${comments.data.data.comments.length}</p>
                            </div>
                            <div class="col-2 buttons${p.id}">
                                <button class="dlt-photo" data-photoId="${p.id}">
                                    <i class="fas fa-trash" data-photoId="${p.id}"></i>
                                </button>
                            </div>
                        </div>
                        <div class="collapse" id="collapseExample${p.id}">
                        <div class="share">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <p class="lead text-center">Who on your Amicus+ list do you want to share this photo with?</p>
                                <div class="row amicusList${p.id} mt-2 scroll"></div>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>`;
            $(".myPhotos").append($pic);
            // Builds amicus list if user deems picture private.
            if (!p.global_share) {
                const $btn = `
                <button class="pic-btn" data-photoId="${p.id} type="button" data-toggle="collapse" data-target="#collapseExample${p.id}" aria-expanded="false" aria-controls="collapseExample${p.id}" id="sharePhoto">
                    <i class="fas fa-share" data-photoId="${p.id}"></i>
                </button>`
                $(`.buttons${p.id}`).append($btn)
                const response = await axios.get(`${API}/api/friends/${token}`)
                // Creates a card for each user on user amicus list.
                response.data.data.amicus.forEach(async (u) => {
                    const user = await axios.get(`${API}/api/users/${u.added_user_id}`)
                    const $card = `
                    <div class="col-12 card">
                        <div class="row p-2">
                            <div class="col-4 align-self-center">
                                <img src="${user.data.data.user.profile_picture_url}"
                                    alt="${user.data.data.user.username} profile picture" class="amicus-photo rounded-circle item">
                            </div>
                            <div class="col-4 align-self-center">
                                <p class="lead item">@${user.data.data.user.username}</p>
                                <p>${user.data.data.user.about}</p>
                            </div>
                            <div class="col-4 align-self-center" id="userBtn${user.data.data.user.id}${p.id}">
                                <button class="btn-primary item" id="share-user" data-user_id="${user.data.data.user.id}" data-pic_id="${p.id}">Share</button>
                            </div>
                        </div>
                    </div>`
                    $(`.amicusList${p.id}`).append($card)
                })
            }
        });
        $('.spinner').hide()
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
};

$("body").on("click", "#lg-btn", (evt) => {
    evt.preventDefault();
    localStorage.clear();
    location.reload();
    location.replace("/amicus-prototype/index.html");
});

$("body").on("click", "#edt-submit", async (evt) => {
    // Updates user profile
    evt.preventDefault();
    const token = localStorage.getItem("token");
    const $firstName = $("#firstName").val();
    const $lastName = $("#lastName").val();
    const $email = $("#email").val();
    const $about = $("#about").val();
    if (!$firstName || !$lastName || !$email || !$about) {
        $("#alert")
            .text("All fields are required!")
            .addClass("alert-danger")
            .addClass("text-center");
        return;
    }
    try {
        const response = await axios.put(`${API}/api/users/update`, {
            _token: token,
            data: {
                email: $email,
                first_name: $firstName,
                last_name: $lastName,
                about: $about,
            },
        });
        if (response.status === 200) {
            location.reload();
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
});

$("body").on('click', '#pic-submit', async (evt) => {
    evt.preventDefault()
    try {
        const token = localStorage.getItem('token');
        if (imagebase64 === undefined) {
            $("#alert")
                .text("Upload photo first")
                .addClass("alert-danger")
                .addClass("text-center");
            return;
        }
        const response = await axios.put(`${API}/api/users/picture`, {
            _token: token,
            data: {
                blob: imagebase64
            }
        })
        if (response.status === 200) {
            location.reload()
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

$('body').on('click', '.dlt-photo', async (evt) => {
    evt.preventDefault()
    const $photoId = $(evt.target).attr('data-photoId')
    try {
        const response = await axios.delete(`${API}/api/pictures/delete/${$photoId}`)
        if (response.status == 200) {
            location.reload()
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

$('body').on('click', '#sharePhoto', async (evt) => {
    evt.preventDefault()
    const token = localStorage.getItem('token')
    const $picId = $(evt.target).attr('data-photoId')
    try {
        const response = await axios.get(`${API}/api/shares/${$picId}/${token}`)
        if (response.data.data.users.length > 0) {
            response.data.data.users.forEach(u => {
                $(`#userBtn${u.user_id}${$picId}`).empty()
            })
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

$('body').on('click', '#share-user', async (evt) => {
    evt.preventDefault()
    const token = localStorage.getItem('token')
    const $userId = $(evt.target).attr('data-user_id');
    const $picId = $(evt.target).attr('data-pic_id');
    try {
        const response = await axios.post(`${API}/api/shares`, {
            _token: token,
            data: {
                picture_id: +$picId,
                user_id: +$userId
            }
        })
        if (response.status === 200) {
            $(`#userBtn${$userId}${$picId}`).empty()
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

userProfile();