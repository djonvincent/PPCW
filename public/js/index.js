let searchField = document.getElementById('searchField');
let results = document.getElementById('results');
let inDebounce;
searchField.addEventListener('input', () => {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(updateResults, 500);
});
function updateResults () {
    let term = searchField.value;
    if (term === '') {
        results.innerHTML = '';
        return;
    }
    fetch('/people/search/' + term, {method: 'get'})
    .then(res => res.json())
    .then(data => {
        results.innerHTML = '';
        for (let i=0; i<data.length; i++) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.innerHTML = data[i];
            a.href = '/profile/' + data[i];
            li.appendChild(a);
            results.appendChild(li);
        }
    });
};
