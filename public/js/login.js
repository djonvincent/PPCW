let loginUsername = document.getElementById('loginUsername');
let loginPassword = document.getElementById('loginPassword');
let loginButton = document.getElementById('loginButton');
let loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let username = loginUsername.value;
    let password = loginPassword.value;
    fetch('/api/login', {
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
        loginUsername.innerHTML = '';
        loginPassword.innerHTML = '';
        localStorage.setItem('apiKey', data.key);
        navigate('/');
        updateFeed();
    })
    .catch(err => {
        alert('Invalid credentials');
    });
});
