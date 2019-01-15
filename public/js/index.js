let searchField = document.getElementById('searchField');
let results = document.getElementById('results');
let resultsSpinner = document.getElementById('resultsSpinner');
let logoutButton = document.getElementById('logoutButton');
let inDebounce;
searchField.addEventListener('input', () => {
    results.style.display = 'none';
    clearTimeout(inDebounce);
    if (searchField.value) {
        resultsSpinner.style.display = '';
        inDebounce = setTimeout(updateSearchResults, 500);
    } else {
        resultsSpinner.style.display = 'none';
    }
});

document.addEventListener('click', e => {
    if (!e.target.contains(results)) {
        results.style.display = 'none';
    }
});

function updateSearchResults () {
    let term = searchField.value;
    fetch('/api/people/search/' + term, {method: 'get'})
    .then(res => res.json())
    .then(data => {
        resultsSpinner.style.display = 'none';
        results.style.display = '';
        results.innerHTML = '';
        if (data.length === 0) {
            results.innerHTML = 'No results';
        }
        for (let i=0; i<data.length; i++) {
            let item = document.createElement('div');
            let a = document.createElement('a');
            a.innerHTML = data[i];
            a.className = 'username route';
            a.href = '/profile/' + data[i];
            results.appendChild(a);
        }
    });
};

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('apiKey');
    navigate('/login');
    updateFeed();
});
