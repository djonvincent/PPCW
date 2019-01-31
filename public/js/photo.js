(() => {
let photoImage = document.getElementById('photoImage');
let photoPhoto = document.getElementById('photoPhoto');
let photoLikeButton = document.getElementById('photoLikeButton');
let photoLikeText = document.getElementById('photoLikeText');
let photoDate = document.getElementById('photoDate');
let photoDescription = document.getElementById('photoDescription');
let photoDescriptionStatic = document.getElementById('photoDescriptionStatic');
let photoEditButton = document.getElementById('photoEditButton');
let photoDeleteButton = document.getElementById('photoDeleteButton');
let photoSavedChanges = document.getElementById('photoSavedChanges');
let originalDescription;

photoDescription.addEventListener('input', e => {
    if (photoDescription.value !== originalDescription) {
        photoEditButton.disabled = false;
        photoSavedChanges.style.display = 'none';
    } else {
        photoEditButton.disabled = true;
        photoSavedChanges.style.display = '';
    }
});

window.photoHandler = params => {
    photoImage.src = '';
    photoDate.innerHTML = '';
    photoDescription.value = '';
    photoSavedChanges.style.visibility = 'hidden';
    photoEditButton.style.display = 'none';
    photoDeleteButton.style.display = 'none';
    photoDescription.style.display = 'none';
    let photoId = params.id
    let apiKey = localStorage.getItem('apiKey');
    let username = localStorage.getItem('username');
    if (!photoId) {
        return;
    }
    photoEditForm.onsubmit = e => {
        e.preventDefault();
        fetch('/photo/' + photoId, {
            method: 'put',
            headers: new Headers({
                'Authorization': apiKey,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                description: photoDescription.value
            })
        })
        .then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res.json();
        })
        .then(data => {
            photoDescription.value = data.description;
            originalDescription = data.description;
            photoEditButton.disabled = true;
            photoSavedChanges.style.display = '';
        });
    };

    photoDeleteButton.onclick = e => {
        fetch('/photo/' + photoId, {
            method: 'delete',
            headers: new Headers({'Authorization': apiKey})
        })
        .then(res => {
            if (!res.ok) {
                alert(res.statusText);
                return;
            }
            navigate('/profile/me');
        });
    };
            
    fetch('/photo/' + photoId, {
        method: 'get',
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => {
        if (!res.ok) {
            throw Error(response.statusText);
        }
        return res.json()
    })
    .then(data => {
        photoPhoto.style.paddingTop = (100*data.height/data.width) + '%';
        photoImage.src = data.path;
        let likes = data.likes.length;
        photoLikeText.innerHTML = likes + ' like' + (likes === 1 ? '' : 's');
        let liked = false;
        if (data.likes.indexOf(username) !== -1) {
            photoLikeButton.classList.add('liked');
            liked = true;
        }
        photoLikeButton.addEventListener('click', e => {
            if (liked) {
                photoLikeButton.classList.remove('liked');
            } else {
                photoLikeButton.classList.add('liked');
            }
            updateLikeStatus(data.id, !liked)
            .then(data => {
                let likes = data.likes.length;
                photoLikeText.innerHTML = likes + ' like' + (likes === 1 ? '' : 's');
            });
            liked = !liked;
        });
        let date = new Date(data.date);
        photoDate.innerHTML = `
            Uploaded on ${date.toLocaleDateString()} at 
            ${date.toLocaleTimeString().substring(0,5)}
        `;
        photoDescriptionStatic.innerHTML = data.description;
        if (data.user === username) {
            photoDescription.value = data.description;
            photoDescriptionStatic.style.display = 'none';
            photoDescription.style.display = '';
            photoEditButton.style.display = '';
            photoDeleteButton.style.display = '';
            photoSavedChanges.style.visibility = 'visible';
            originalDescription = data.description;
        }
    })
    .catch(err => {
        alert(err);
    });
};
})();
