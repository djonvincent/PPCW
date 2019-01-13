let usernameField = document.getElementById('username');
let passwordField = document.getElementById('password');
let loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', e => {
    let username = usernameField.value;
    let password = passwordField.value;
    fetch('/login', {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        })
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw Error(response.statusText);
    })
    .then(data => {
        localStorage.setItem('apiKey', data.key);
        window.location.pathname = '/';
    })
    .catch(err => {
        alert('Invalid credentials');
    });
});
