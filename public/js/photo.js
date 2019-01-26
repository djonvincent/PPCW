let photoImage = document.getElementById('photoImage');
let photoDate = document.getElementById('photoDate');
let photoDescription = document.getElementById('photoDescription');
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

function photoHandler(params) {
    photoImage.src = '';
    photoDate.innerHTML = '';
    photoDescription.value = '';
    photoSavedChanges.style.display = 'none';
    photoEditButton.style.display = 'none';
    photoDeleteButton.style.display = 'none';
    photoDescription.readOnly = true;
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
        photoImage.src = data.path;
        let date = new Date(data.date);
        photoDate.innerHTML = `
            Uploaded on ${date.toLocaleDateString()} at 
            ${date.toLocaleTimeString().substring(0,5)}
        `;
        photoDescription.value = data.description;
        if (data.user === username) {
            photoDescription.readOnly = false;
            photoEditButton.style.display = '';
            photoDeleteButton.style.display = '';
            photoSavedChanges.style.display = '';
            originalDescription = data.description;
        }
    })
    .catch(err => {
        alert(err);
    });
}
