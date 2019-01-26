let feed = document.getElementById('feed');
let feedRefreshButton = document.getElementById('feedRefreshButton');
let lastRefreshTime;

feedRefreshButton.addEventListener('click', updateFeed);

const ptr = PullToRefresh.init({
    triggerElement: '#feed',
    distMax: 200,
    distThreshold: 100,
    distReload: 100,
	resistanceFunction(t) {
		return 1;
	},
    getMarkup () {
        return `
			<span id="ptrArrow" class="oi oi-arrow-bottom"></span>
        	<div id="ptrSpinner" class="spinner-border large-spinner"></div>
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
			#ptrSpinner {
				display: none;
			}
			.__PREFIX__refresh #ptrSpinner {
				display: block;
			}
			#ptrArrow {
				transition: transform .3s;
			}
			.__PREFIX__refresh #ptrArrow {
				display: none;
			}
            .__PREFIX__pull {
                transition: none;
            }
			.__PREFIX__release #ptrArrow {
				transform: rotate(180deg);
			}
        `;
    },
	onInit() {
		document.getElementById('ptrArrow').style.display = '';
	},
    onRefresh() {
        updateFeed();
		document.getElementById('ptrArrow').style.display = 'none';
    }
});

function feedHandler () {
    if (!lastRefreshTime || Date.now() - lastRefreshTime >= 60*1000) {
        updateFeed();
    }
}

function updateFeed () {
    let apiKey = localStorage.getItem('apiKey');
    fetch('/feed', {
        method: 'get',
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    })
    .then(data => {
        lastRefreshTime = Date.now()
        feed.innerHTML = '';
        for(let i=0; i<data.length; i++) {
            let li = document.createElement('li');
            let card = document.createElement('div');
            card.className = 'card mb-2 border-0';
            let avatar = document.createElement('img');
            avatar.className = 'rounded-circle avatar';
            avatar.src = '/images/avatar.png';
            let title = document.createElement('a');
            title.href = '/profile/' + data[i].user;
            title.className = "username route m-1";
            title.appendChild(avatar);
            title.innerHTML += data[i].user;
			let photo = document.createElement('div');
			photo.className = 'photo';
            photo.style.paddingTop = (100*data[i].height/data[i].width) + '%';
            let img = document.createElement('img');
            img.src = data[i].path;
			photo.appendChild(img);
            let body = document.createElement('div');
            body.className = 'card-body';
            let desc = document.createElement('p');
            desc.className = 'card-text mb-1';
            desc.innerHTML = data[i].description;
            let date = document.createElement('p');
            date.className = 'card-text text-muted';
            date.innerHTML = timeDeltaFormat(new Date(data[i].date));
            body.appendChild(desc);
            body.appendChild(date)
            card.appendChild(photo);
            card.appendChild(body)
            li.appendChild(title);
            li.appendChild(card);
            feed.appendChild(li);
        };
    });
}
