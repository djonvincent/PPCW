let logOutButton = document.getElementById('logout');
logOutButton.addEventListener('click', e => {
    localStorage.removeItem('apiKey');
    window.location.pathname = '/login.html';
});
