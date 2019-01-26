(() => {
    let searchField = document.getElementById('searchField');
    let searchSpinner = document.getElementById('searchSpinner');
    let searchResults = document.getElementById('searchResults');
    let inDebounce;

    searchField.addEventListener('input', () => {
        searchResults.style.display = 'none';
        clearTimeout(inDebounce);
        if (searchField.value) {
            searchSpinner.style.display = '';
            inDebounce = setTimeout(updateSearchResults, 500);
        } else {
            searchSpinner.style.display = 'none';
        }
    });

    function updateSearchResults () {
        let term = searchField.value;
        fetch('/people/search/' + term, {method: 'get'})
        .then(res => res.json())
        .then(data => {
            searchSpinner.style.display = 'none';
            searchResults.style.display = '';
            searchResults.innerHTML = '';
            if (data.length === 0) {
                searchResults.innerHTML = 'No results';
            }
            for (let i=0; i<data.length; i++) {
                let item = document.createElement('li');
                let a = document.createElement('a');
                a.innerHTML = data[i];
                a.className = 'username route d-block';
                a.href = '/profile/' + data[i];
                searchResults.appendChild(a);
            }
        });
    };
})();
