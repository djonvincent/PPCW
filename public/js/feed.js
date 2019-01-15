let feed = document.getElementById('feed');
let feedRefreshButton = document.getElementById('feedRefreshButton');
updateFeed();
feedRefreshButton.addEventListener('click', updateFeed);
function updateFeed () {
    let apiKey = localStorage.getItem('apiKey');
    fetch('/api/feed', {
        method: 'get',
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => res.json())
    .then(data => {
        feed.innerHTML = '';
        for(let i=0; i<data.length; i++) {
            let li = document.createElement('li');
            let title = document.createElement('a');
            title.innerHTML = data[i].user;
            title.href = '/profile/' + data[i].user;
            title.className = "username route";
            let desc = document.createElement('p');
            desc.innerHTML = data[i].description;
            let dateField = document.createElement('p');
            let date = new Date(data[i].date);
            let dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            dateField.innerHTML = dateString;
            let img = document.createElement('img');
            img.src = data[i].path;
            li.appendChild(title);
            li.appendChild(img);
            li.appendChild(dateField)
            li.appendChild(desc);
            feed.appendChild(li);
        };
    });
}
