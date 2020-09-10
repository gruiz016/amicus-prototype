$('.share').hide()

$('#pic-submit').on('click', async (evt) => {
    evt.preventDefault()
    try {
        const token = localStorage.getItem('token');
        // Checks if the image was uploaded.
        if (imagebase64 === undefined) {
            $("#alert")
                .text("Upload photo first")
                .addClass("alert-danger")
                .addClass("text-center");
            return;
        }
        // Checks the value of the radio buttons
        const options = document.getElementsByName('options')
        let isGlobal;
        options.forEach(e => {
            if (e.checked) {
                isGlobal = (e.id === 'true')
            }
        })
        if (isGlobal === undefined) {
            $("#alert")
                .text("You must select if the photo is global or not!")
                .addClass("alert-danger")
                .addClass("text-center");
            return;
        }
        // Calls to the api to commit photo
        const response = await axios.post(`${API}/api/pictures`, {
            _token: token,
            data: {
                blob: imagebase64,
                global_share: isGlobal
            }
        })
        // handles what happens if photo is global
        if (isGlobal === true) {
            if (response.status === 200) {
                location.replace('/user/user.html')
            }
        } else {
            // Handles what happens if the picture is private.
            $('.upload').hide()
            const response = await axios.get(`${API}/api/friends/${token}`)
            // Creates a card for each user on user amicus list.
            response.data.data.amicus.forEach(async (u) => {
                const user = await axios.get(`${API}/api/users/${u.added_user_id}`)
                const $card = `
                <div class="col-12 card">
                    <div class="row p-2">
                        <div class="col-4 align-self-center">
                            <img src="${user.data.data.user.profile_picture_url}"
                                alt="${user.data.data.user.username} profile picture" class="user-photo rounded-circle item">
                        </div>
                        <div class="col-4 align-self-center">
                            <p class="lead item">@${user.data.data.user.username}</p>
                            <p>${user.data.data.user.about}</p>
                        </div>
                        <div class="col-4 align-self-center">
                            <button class="btn-primary item" id="add-user">Share</button>
                        </div>
                    </div>
                </div>`
                $('.amicusList').append($card)
            })
            $('.share').show()
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})