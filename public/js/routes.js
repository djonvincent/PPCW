let routes = [];
let activeRoute;
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

document.addEventListener('click', e => {
    let el = e.target;
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

function stripAppPrefix(path) {
    if (path.substring(0, 4) === '/app') {
        path = path.substring(4);
    }
    if (path === '') {
        path = '/';
    }
    return path;
}

function navigate(path) {
    path = stripAppPrefix(path);
    window.history.pushState(
        {},
        '/app' + path,
        window.location.origin + '/app' + path
    );
    loadPage(path);
}

function loadPage (path) {
    path = stripAppPrefix(path);
	let m;
	let route = routes.find(r => {
		m = path.match(r.re)
		return m;
	});
	if (!route) {
		return;
	}
	let params = {}
	for (let i=0; i<route.params.length; i++) {
		params[route.params[i]] = m[i+1];
	}
	changeActiveNavItem(path);
	if (route.handler) {
		route.handler(params);
	}
	if (activeRoute) {
		activeRoute.el.classList.remove('active');
	}
	route.el.classList.add('active');
	activeRoute = route;
}

function changeActiveNavItem(path) {
    let actives = document.querySelectorAll('.nav-item.active');
    let links = document.querySelectorAll(`a.route[href='${path}']`);
    if (actives) {
        actives.forEach(el => {
            el.classList.remove('active');
        });
    }
    links.forEach(el => {
        el.parentElement.classList.add('active');
    });
}
