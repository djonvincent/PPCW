(() => {
let apiKey = localStorage.getItem('apiKey');
fetch('/people/me', {
    method: 'get',
    headers: new Headers({'Authorization': apiKey})
})
.then(res => {
    if (!res.ok) {
        window.location.pathname = '/login.html';
    }
});
})();
