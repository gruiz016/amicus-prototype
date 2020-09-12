const getAll = async () => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`${API}/api/users/amicus/${token}`)
        response.data.data.users.forEach(async (u) => {
            const check = await axios.get(`${API}/api/friends/check/${token}/${u.id}`)
            const $item = `
            <div class="row p-2">
                <div class="col-2 align-self-center">
                    <img src="${u.profile_picture_url}" alt="${u.username} profile picture" class="user-photo rounded-circle item">
                </div>
                <div class="col-6 align-self-center">
                    <h4 class="lead item">@${u.username}</h4>
                    <p class="item">Bio: ${u.about}.</p>
                </div>
                <div class="col-4 align-self-center" id="buttons${u.id}"></div>
            </div>`
            $('.users').append($item)
            if (check.data.data.check === 0) {
                let $btn = `
                <button class="btn-success item my-2" id="add-btn" data-user_id="${u.id}">Add</button>`
                $(`#buttons${u.id}`).append($btn)
            } else {
                let $btn = `
                <button class="btn-danger item my-2" id="remove-btn" data-user_id="${u.id}">Remove</button>`
                $(`#buttons${u.id}`).append($btn)
            }
        })
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
}

$('body').on('click', '#add-btn', async (evt) => {
    evt.preventDefault()
    const user_id = $(evt.target).attr('data-user_id')
    const token = localStorage.getItem('token')
    try {
        const response = await axios.post(`${API}/api/friends`, {
            _token: token,
            data: {
                added_user_id: +user_id
            }
        })
        if (response.status === 200) {
            $(`#buttons${user_id}`).empty()
            let $btn = `
            <button class="btn-danger item my-2" id="remove-btn" data-user_id="${user_id}">Remove</button>`
            $(`#buttons${user_id}`).append($btn)
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

$('body').on('click', '#remove-btn', async (evt) => {
    evt.preventDefault()
    const user_id = $(evt.target).attr('data-user_id')
    const token = localStorage.getItem('token')
    try {
        const response = await axios.delete(`${API}/api/friends/${token}/${user_id}`, {
            _token: token
        })
        if (response.status === 200) {
            $(`#buttons${user_id}`).empty()
            let $btn = `
        <button class="btn-success item my-2" id="add-btn" data-user_id="${user_id}">Add</button>`
            $(`#buttons${user_id}`).append($btn)
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})

getAll()