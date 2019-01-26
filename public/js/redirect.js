(() => {
if (!localStorage.getItem('username')) {
    window.location.pathname = '/app/login';
    return;
}
let apiKey = localStorage.getItem('apiKey');
fetch('/people/me', {
    method: 'get',
    headers: new Headers({'Authorization': apiKey})
})
.then(res => {
    if (!res.ok) {
        window.location.pathname = '/app/login';
    }
});
})();
