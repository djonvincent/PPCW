let searchField = document.getElementById('searchField');
let results = document.getElementById('results');
let feed = document.getElementById('feed');
let apiKey = localStorage.getItem('apiKey');
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
fetch('/feed', {
    method: 'get',
    headers: new Headers({'Authorization': apiKey})
})
.then(res => res.json())
.then(data => {
    for(let i=0; i<data.length; i++) {
        let li = document.createElement('li');
        let title = document.createElement('p');
        title.innerHTML = data[i].user;
        let desc = document.createElement('p');
        desc.innerHTML = data[i].description;
        let dateField = document.createElement('p');
        let date = new Date(data[i].date);
        let dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        dateField.innerHTML = dateString;
        let img = document.createElement('img');
        img.src = data[i].path;
        li.appendChild(title);
        li.appendChild(desc);
        li.appendChild(dateField)
        li.appendChild(img);
        feed.appendChild(li);
    };
});
