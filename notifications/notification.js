const getNotifications = async () => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`${API}/api/notifications/${token}`)
        response.data.data.notifications.forEach(async (n) => {
            const picture = await axios.get(`${API}/api/pictures/${n.picture_id}`)
            const user = await axios.get(`${API}/api/users/${picture.data.data.picture.user_id}`)
            const $notification = `
                <div class="row justify-content-center my-1">
                    <div class="col-12 col-md-6 card">
                        <div class="row p-2">
                            <div class="col-3">
                                <img src="${user.data.data.user.profile_picture_url}" alt="${user.data.data.user.username} user photo" class="user-photo rounded-circle item">
                            </div>
                            <div class="col-6">
                                <p class="lead item">@${user.data.data.user.username}, has shared a private photo with you.</p>
                                <small>You can only see this picture once!</small>
                            </div>
                            <div class="col-3">
                                <button class="btn-danger item" id="view-noti" data-shared_id="${n.id}">View</button>
                            </div>
                        </div>
                    </div>
                </div>`
            $('.notifications').append($notification)
        })
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
}

$('body').on('click', '#view-noti', async (evt) => {
    evt.preventDefault()
    location.replace('/shared/shared.html')
})

getNotifications()