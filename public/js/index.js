let searchField = document.getElementById('searchField');
let searchButton = document.getElementById('searchButton');
let results = document.getElementById('results');
searchButton.addEventListener('click', e => {
    let term = searchField.value;
    if (term === '') {
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
});
