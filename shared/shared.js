const getPhotos = async () => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`${API}/api/notifications/${token}`)
        response.data.data.notifications.forEach(async (n) => {
            const picture = await axios.get(`${API}/api/pictures/${n.picture_id}`)
            const user = await axios.get(`${API}/api/users/${picture.data.data.picture.user_id}`)
            const likes = await axios.get(`${API}/api/likes/picture/${picture.data.data.picture.id}`);
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
                    <img src="${picture.data.data.picture.picture_url}" alt="User ${user.data.data.user.username} picture" class="post-picture rounded" data-id="${picture.data.data.picture.id}"/>
                  </button>
                  </div>
                </div>
                <div class="row" id="actions">
                  <div class="col-6">
                    <button
                      class="pic-btn"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseLikes${picture.data.data.picture.id}"
                      aria-expanded="false"
                      aria-controls="collapseLikes"
                      id="like${picture.data.data.picture.id}"
                    >
                    </button>
                    <button class="pic-btn" type="button" data-toggle="collapse" data-target="#collapseComments${picture.data.data.picture.id}"
                    aria-expanded="false" aria-controls="collapseComments">
                    <i class="far fa-comments"></i>
                  </button>
                  </div>
                </div>
                <div class="collapse" id="collapseComments${picture.data.data.picture.id}"></div>
                <div class="collapse" id="collapseLikes${picture.data.data.picture.id}">
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
                      <input type="text" class="form-control" id="comment${picture.data.data.picture.id}" aria-describedby="commentHelp">
                    </div>
                    <button type="submit" class="btn btn-primary my-1" id="cmt-submit" data-id="${picture.data.data.picture.id}">Submit</button>
                  </form>
                </div>
              </div>
              </div>
            </div>`;
            $('.shared').append($item);
            // Checks if user liked photo previously
            const answer = await axios.patch(`${API}/api/likes/check/${picture.data.data.picture.id}`, {
                _token: token,
            });
            if (answer.data.data.answer === 0) {
                $(`#like${picture.data.data.picture.id}`).append('<i class="far fa-heart"></i>')
            } else {
                $(`#like${picture.data.data.picture.id}`).append('<i class="fas fa-heart"></i>')
            }
            // Creates and adds comments to the item above
            const comments = await axios.get(`${API}/api/comments/picture/${picture.data.data.picture.id}`);
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
                $(`#collapseComments${picture.data.data.picture.id}`).append($comment);
            });
            await axios.patch(`${API}/api/notifications/update/${n.id}/${token}`)
        })
    } catch (e) {

    }
}

getPhotos()