let loginUsername = document.getElementById('loginUsername');
let loginPassword = document.getElementById('loginPassword');
let loginButton = document.getElementById('loginButton');
let loginForm = document.getElementById('loginForm');
let errorMessage = document.getElementById('errorMessage');

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
