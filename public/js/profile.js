let usernameField = document.getElementById('username');
let nameField = document.getElementById('name');
let photosList = document.getElementById('photos');
let followButton = document.getElementById('follow');
let username = window.location.pathname.substring(9);
let apiKey = localStorage.getItem('apiKey');
fetch('/people/me', {
    method: 'get',
    headers: new Headers({'Authorization': apiKey})
})
.then(res => res.json())
.then(data => {
    if (data.username === username) {
        followButton.hidden = true;
        return;
    }
    if (data.follows.indexOf(username) === -1) {
        followButton.value = 'follow';
        followButton.addEventListener('click', follow);
    } else {
        followButton.value = 'unfollow';
        followButton.addEventListener('click', unfollow);
    }
});
fetch('/people/' + username + '?expand=photos', {
    method: 'get'
})
.then(res => res.json())
.then(data => {
    usernameField.innerHTML = data.username;
    nameField.innerHTML = data.forename + ' ' + data.surname;
    for(let i=0; i<data.photos.length; i++) {
        let li = document.createElement('li');
        let title = document.createElement('p');
        title.innerHTML = data.photos[i].description;
        let img = document.createElement('img');
        img.src = data.photos[i].path;
        li.appendChild(title);
        li.appendChild(img);
        photosList.appendChild(li);
    };
});
function follow () {
    fetch('/follow/' + username, {
        method: 'post',
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => {
        if (!res.ok) {
            return;
        }
        followButton.value = 'unfollow';
        followButton.removeEventListener('click', follow);
        followButton.addEventListener('click', unfollow);
    });
}
function unfollow () {
    fetch('/follow/' + username, {
        method: 'delete',
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => {
        if (!res.ok) {
            return;
        }
        followButton.value = 'follow';
        followButton.removeEventListener('click', unfollow);
        followButton.addEventListener('click', follow);
    });
}

