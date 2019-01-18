let photoImage = document.getElementById('photoImage');
let photoDescription = document.getElementById('photoDescription');

function photoHandler(params) {
    let photoId = params.id
    if (!photoId) {
        return;
    }
    let apiKey = localStorage.getItem('apiKey');
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
        photoDescription.innerHTML = data.description;
    })
    .catch(err => {
        alert(err);
    });
}
