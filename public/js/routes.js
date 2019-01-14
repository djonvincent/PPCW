const routes = {
    '/': feed,
    '/login': login,
    '/upload': upload
};

let container = document.getElementById('container');
container.innerHTML = routes[window.location.pathname];

document.querySelectorAll('a.route').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        let route = el.pathname;
        navigate(route);
    });
});

window.onpopstate = () => {
    container.innerHTML = routes[window.location.pathname];
};

function navigate(route) {
    window.history.pushState(
        {},
        route,
        window.location.origin + route
    );
    container.innerHTML = routes[route];
}
