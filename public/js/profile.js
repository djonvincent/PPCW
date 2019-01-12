let usernameField = document.getElementById('username');
let nameField = document.getElementById('name');
let photosList = document.getElementById('photos');
let username = window.location.pathname.substring(9);
let apiKey = localStorage.getItem('apiKey');
fetch('/people/' + username + '?expand=photos', {
    method: 'get',
    headers: new Headers({'Authorization': apiKey})
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
