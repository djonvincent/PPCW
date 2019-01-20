let photoImage = document.getElementById('photoImage');
let photoDate = document.getElementById('photoDate');
let photoDescription = document.getElementById('photoDescription');
let photoEditButton = document.getElementById('photoEditButton');
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
    let photoId = params.id
    let apiKey = localStorage.getItem('apiKey');
    if (!photoId) {
        return;
    }
    photoEditForm.onsubmit = e => {
        e.preventDefault();
        fetch('/api/photo/' + photoId, {
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
        fetch('/api/photo/' + photoId, {
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
            
    fetch('/api/photo/' + photoId, {
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
        originalDescription = data.description;
    })
    .catch(err => {
        alert(err);
    });
}
