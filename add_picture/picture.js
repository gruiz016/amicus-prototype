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
        // redirects after succesful commit
        if (response.status === 200) {
            location.replace('/amicus-prototype/user/user.html')
        }
    } catch (e) {
        $("#alert")
            .text("Opppps... Something went wrong")
            .addClass("alert-danger")
            .addClass("text-center");
    }
})