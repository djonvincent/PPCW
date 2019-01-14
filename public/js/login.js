let loginUsername = document.getElementById('loginUsername');
let loginPassword = document.getElementById('loginPassword');
let loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', e => {
    let username = loginUsername.value;
    let password = loginPassword.value;
    fetch('/api/login', {
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
        window.apiKey = data.key;
        navigate('/');
    })
    .catch(err => {
        alert('Invalid credentials');
    });
});
