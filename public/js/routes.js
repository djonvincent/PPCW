let routes = [];
document.querySelectorAll('div.page').forEach(el => {
    let route = el.dataset.route;
    let params = [];
    let re = route.replace(/:[^\/]+/g, m => {
        params.push(m.substring(1));
        return '([^/]+)';
    });
    re = '^' + re + '$';
    routes.push({
        re: re,
        params: params,
        handler: window[el.dataset.handler],
        el: el
    });
});  

loadPage(window.location.pathname);

document.addEventListener('click', e  => {
    let el = e.target
    while (el && !(el.classList.contains('route') && el.tagName === 'A')) {
        el = el.parentElement;
    }
    if (el) {
        e.preventDefault();
        navigate(el.pathname);
    }
});

window.onpopstate = () => {
    loadPage(window.location.pathname);
};

function navigate(path) {
    window.history.pushState(
        {},
        path,
        window.location.origin + path
    );
    loadPage(path);
}

function loadPage (path) {
    let active = document.querySelector('div.page.active');
    for (route of routes) {
        let m = path.match(route.re)
        if (m) {
            changeActiveNavItem(path);
            let newActive = route.el;
            let params = {}
            for (let i=0; i<route.params.length; i++) {
                params[route.params[i]] = m[i+1];
            }
            if (route.handler) {
                route.handler(params);
            }
            if (active) {
                active.classList.remove('active');
            }
            newActive.classList.add('active');
        }
    }
};

function changeActiveNavItem(path) {
    let actives = document.querySelectorAll('.nav-item.active');
    let links = document.querySelectorAll(`a.route[href='${path}']`);
    links.forEach(el => {
        el.parentElement.classList.add('active');
    });
    if (links) {
        actives.forEach(el => {
            el.classList.remove('active');
        });
    }
}
