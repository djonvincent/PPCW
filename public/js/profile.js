let profileUsername = document.getElementById('profileUsername');
let profileName = document.getElementById('profileName');
let profilePhotos = document.getElementById('profilePhotos');
let profileFollowButton = document.getElementById('profileFollowButton');

function profileHandler(params) {
    loadProfile();

    function loadProfile() {
        let apiKey = localStorage.getItem('apiKey');
        let username = params.username;
        fetch('/api/people/me', {
            method: 'get',
            headers: new Headers({'Authorization': apiKey})
        })
        .then(res => res.json())
        .then(data => {
            if (data.username === username || username === 'me') {
                profileFollowButton.hidden = true;
                return;
            } else {
                profileFollowButton.hidden = false;
            }
            if (data.follows.indexOf(username) === -1) {
                profileFollowButton.innerHTML = 'Follow';
                profileFollowButton.addEventListener('click', follow);
            } else {
                profileFollowButton.innerHTML = 'Unfollow';
                profileFollowButton.addEventListener('click', unfollow);
            }
        });
        fetch('/api/people/' + username + '?expand=photos', {
            method: 'get',
            headers: new Headers({'Authorization': apiKey})
        })
        .then(res => res.json())
        .then(data => {
            profileUsername.innerHTML = data.username;
            profileName.innerHTML = data.forename + ' ' + data.surname;
            profilePhotos.innerHTML = '';
            for(let i=0; i<data.photos.length; i++) {
                let li = document.createElement('li');
                let title = document.createElement('p');
                title.innerHTML = data.photos[i].description;
                let img = document.createElement('img');
                img.className = 'photo';
                img.src = data.photos[i].path;
                li.appendChild(title);
                li.appendChild(img);
                profilePhotos.appendChild(li);
            };
        });
    };

    function follow () {
        let apiKey = localStorage.getItem('apiKey');
        fetch('/api/follow/' + params.username, {
            method: 'post',
            headers: new Headers({'Authorization': apiKey})
        })
        .then(res => {
            if (!res.ok) {
                return;
            }
            profileFollowButton.innerHTML = 'Unfollow';
            profileFollowButton.removeEventListener('click', follow);
            profileFollowButton.addEventListener('click', unfollow);
        });
    }

    function unfollow () {
        let apiKey = localStorage.getItem('apiKey');
        fetch('/api/follow/' + params.username, {
            method: 'delete',
            headers: new Headers({'Authorization': apiKey})
        })
        .then(res => {
            if (!res.ok) {
                return;
            }
            profileFollowButton.innerHTML = 'Follow';
            profileFollowButton.removeEventListener('click', unfollow);
            profileFollowButton.addEventListener('click', follow);
        });
    }
}
