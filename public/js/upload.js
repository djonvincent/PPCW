let uploadFile = document.getElementById('uploadFile');
let uploadDescription = document.getElementById('uploadDescription');
let uploadButton = document.getElementById('uploadButton');
uploadButton.addEventListener('click', e => {
    let apiKey = localStorage.getItem('apiKey');
    if (uploadFile.files.length !== 1) {
        return;
    }
    let fd = new FormData();
    fd.append('photo', uploadFile.files[0]);
    fd.append('description', uploadDescription.value);
    fetch('/api/photo', {
        method: 'post',
        headers: new Headers({'Authorization': apiKey}),
        body: fd
    })
    .then(res => {
        navigate('/');
    });
});
