(() => {
    let navSearchField = document.getElementById('navSearchField');
    let navSearchResults = document.getElementById('navSearchResults');
    let navSearchSpinner = document.getElementById('navSearchSpinner');
    let logoutButton = document.getElementById('logoutButton');
    let logoutButtonMobile = document.getElementById('logoutButtonMobile');
    let inDebounce;

    navSearchField.addEventListener('input', () => {
        navSearchResults.style.display = 'none';
        clearTimeout(inDebounce);
        if (navSearchField.value) {
            navSearchSpinner.style.display = '';
            inDebounce = setTimeout(updateSearchResults, 500);
        } else {
            navSearchSpinner.style.display = 'none';
        }
    });

    document.addEventListener('click', e => {
        if (!e.target.contains(navSearchResults)) {
            navSearchResults.style.display = 'none';
        }
    });

    function updateSearchResults () {
        let term = navSearchField.value;
        fetch('/people/search/' + term, {method: 'get'})
        .then(res => res.json())
        .then(data => {
            navSearchSpinner.style.display = 'none';
            navSearchResults.style.display = '';
            navSearchResults.innerHTML = '';
            if (data.length === 0) {
                navSearchResults.innerHTML = 'No results';
            }
            for (let i=0; i<data.length; i++) {
                let item = document.createElement('div');
                let a = document.createElement('a');
                a.innerHTML = data[i];
                a.className = 'username route';
                a.href = '/profile/' + data[i];
                navSearchResults.appendChild(a);
            }
        });
    };

    logoutButton.addEventListener('click', logout);
    logoutButtonMobile.addEventListener('click', logout);
    function logout() {
        localStorage.removeItem('apiKey');
        localStorage.removeItem('username');
        window.location.pathname = '/app/login';
    }
})();
