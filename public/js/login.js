let loginUsername = document.getElementById('loginUsername');
let loginPassword = document.getElementById('loginPassword');
let loginButton = document.getElementById('loginButton');
let loginForm = document.getElementById('loginForm');
let errorMessage = document.getElementById('errorMessage');
let backgroundIndex = 0;
let backgrounds = [
    '/images/background1.jpg',
    '/images/background2.jpg',
    '/images/background3.jpg',
    '/images/background4.jpg',
    '/images/background5.jpg'
]

for (let path of backgrounds.slice(1)) {
    let img = document.createElement('img');
    img.src = path;
}

setTimeout(() => {
    advanceBackground();
    setInterval(advanceBackground, 8000);
}, 5000);

function advanceBackground() {
    backgroundIndex ++;
    if (backgroundIndex >= backgrounds.length) {
        backgroundIndex = 0;
    }
    document.body.style.backgroundImage = `url('${backgrounds[backgroundIndex]}')`;
}

loginForm.addEventListener('submit', e => {
    loginForm.classList.remove('was-validated');
    errorMessage.style.display = 'none';
    e.preventDefault();
    if (!loginForm.checkValidity()) {
        loginForm.classList.add('was-validated');
        return;
    }
    let username = loginUsername.value;
    let password = loginPassword.value;
    fetch('/login', {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        })
    })
    .then(res => {
        if (!res.ok) {
            throw Error(response.statusText);
        }
        return res.json();
    })
    .then(data => {
        localStorage.setItem('apiKey', data.key);
        localStorage.setItem('username', data.username); 
        window.location.pathname = 'app/';
    })
    .catch(err => {
        errorMessage.style.display = '';
    });
});
