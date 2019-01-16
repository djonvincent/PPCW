let feed = document.getElementById('feed');
let feedRefreshButton = document.getElementById('feedRefreshButton');
updateFeed();
feedRefreshButton.addEventListener('click', updateFeed);

const ptr = PullToRefresh.init({
    triggerElement: '#feed',
    onInit() {
        feedRefreshButton.style.display = 'none';
    },
    distMax: 180,
    distThreshold: 100,
    distReload: 80,
    getMarkup () {
        return `
                <div id="ptrSpinner" class="spinner-border"></div>
        `;
    },
    getStyles () {
        return `
            .__PREFIX__ptr {
                pointer-events: none;
                top: 0;
                height: 0;
                transition: height 0.3s, min-height 0.3s;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                overflow: hidden;
            }
            .__PREFIX__pull {
                transition: none;
            }
        `;
    },
    onRefresh() {
        updateFeed();
    },
});

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
            let avatar = document.createElement('img');
            avatar.className = 'rounded-circle avatar';
            avatar.src = '/images/avatar.png';
            let title = document.createElement('a');
            title.href = '/profile/' + data[i].user;
            title.className = "username route";
            title.appendChild(avatar);
            title.innerHTML += data[i].user;
            let desc = document.createElement('p');
            desc.innerHTML = data[i].description;
            let dateField = document.createElement('p');
            let date = new Date(data[i].date);
            let dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            dateField.innerHTML = dateString;
            let img = document.createElement('img');
            img.className = 'photo';
            img.src = data[i].path;
            li.appendChild(title);
            li.appendChild(img);
            li.appendChild(dateField)
            li.appendChild(desc);
            feed.appendChild(li);
        };
    });
}
