let photoField = document.getElementById('photoField');
let descField = document.getElementById('description');
let uploadButton = document.getElementById('uploadButton');
let apiKey = localStorage.getItem('apiKey');
uploadButton.addEventListener('click', e => {
    if (photoField.files.length !== 1) {
        return;
    }
    let fd = new FormData();
    fd.append('photo', photoField.files[0]);
    fd.append('description', descField.value);
    fetch('/photo', {
        method: 'post',
        headers: new Headers({'Authorization': apiKey}),
        body: fd
    })
    .then(res => {
        photoField.value = '';
        descField.value = '';
    });
});
