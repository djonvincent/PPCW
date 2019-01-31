let feed = document.getElementById('feed');
let feedRefreshButton = document.getElementById('feedRefreshButton');
let feedSpinner = document.getElementById('feedSpinner');
let lastRefreshTime;

feedRefreshButton.addEventListener('click', updateFeed);
// Hide refresh button on touchscreen devices
if ('ontouchstart' in window) {
    feedRefreshButton.style.display = 'none';
}

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
    updateFeed();
    /*
    if (!lastRefreshTime || Date.now() - lastRefreshTime >= 60*1000) {
        updateFeed();
    }*/
}

function updateFeed () {
    let apiKey = localStorage.getItem('apiKey');
    let username = localStorage.getItem('username');
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
        feedSpinner.style.display = 'none';
        if (data.length === 0) {
            let li = document.createElement('li');
            li.className = 'text-center mt-5';
            li.innerHTML = 'Your feed is empty, follow somebody!';
            feed.appendChild(li);
        }
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
            let a = document.createElement('a');
            a.className = 'route';
            a.href = '/photo/' + data[i].id;
			let photo = document.createElement('div');
			photo.className = 'photo';
            photo.style.paddingTop = (100*data[i].height/data[i].width) + '%';
            let img = document.createElement('img');
            img.src = data[i].path;
            img.alt = '';
			photo.appendChild(img);
            a.appendChild(photo);
            let body = document.createElement('div');
            body.className = 'card-body';
            let likeText = document.createElement('p');
            likeText.className = 'card-text text-muted float-right m-1 mr-3';
            let likes = data[i].likes.length;
            likeText.innerHTML = likes + ' like' + (likes === 1 ? '' : 's');
            let likeBtn = document.createElement('button');
            likeBtn.className = 'like';
            likeBtn.type = 'button';
            let liked = false;
            if (data[i].likes.indexOf(username) !== -1) {
                likeBtn.classList.add('liked');
                liked = true;
            }
            likeBtn.addEventListener('click', e => {
                if (liked) {
                    likeBtn.classList.remove('liked');
                } else {
                    likeBtn.classList.add('liked');
                }
                likeBtn.classList.add('clicked');
                setTimeout(() => {
                    likeBtn.classList.remove('clicked');
                }, 50);
                updateLikeStatus(data[i].id, !liked)
                .then(data => {
                    let likes = data.likes.length;
                    likeText.innerHTML = likes + ' like' + (likes === 1 ? '' : 's');
                });
                liked = !liked;
            });
            let heart = document.createElement('span');
            heart.className = 'oi oi-heart';
            likeBtn.appendChild(heart);
            let desc = document.createElement('p');
            desc.className = 'card-text mb-1';
            desc.innerHTML = data[i].description;
            let date = document.createElement('p');
            date.className = 'card-text text-muted';
            date.innerHTML = timeDeltaFormat(new Date(data[i].date));
            body.appendChild(likeBtn);
            body.append(likeText);
            body.appendChild(desc);
            body.appendChild(date)
            card.appendChild(a);
            card.appendChild(body)
            li.appendChild(title);
            li.appendChild(card);
            feed.appendChild(li);
        };
    });
    feedSpinner.style.display = '';
}

