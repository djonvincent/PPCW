let uploadFile = document.getElementById('uploadFile');
let uploadDescription = document.getElementById('uploadDescription');
let uploadButton = document.getElementById('uploadButton');
let uploadPreview = document.getElementById('uploadPreview');
let uploadForm = document.getElementById('uploadForm');
let uploadFieldSet = document.getElementById('uploadFieldset');
let uploadChooseFileButton = document.getElementById('uploadChooseFileButton');
let uploadLoadingScreen = document.getElementById('uploadLoadingScreen');

uploadChooseFileButton.addEventListener('click', () => {
    uploadFile.click();
});

uploadFile.addEventListener('change', () => {
	if (!uploadFile.files) {
		return;
	}
    let reader = new FileReader();
    reader.addEventListener('load', e => {
        uploadPreview.style.backgroundImage = `url(${e.target.result})`;
    });
    reader.readAsDataURL(uploadFile.files[0]);
});

uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    let apiKey = localStorage.getItem('apiKey');
    if (uploadFile.files.length !== 1) {
        return;
    }
    let fd = new FormData();
    fd.append('photo', uploadFile.files[0]);
    fd.append('description', uploadDescription.value);
    uploadLoadingScreen.classList.add('loading');
    uploadFieldset.disabled = true;
    fetch('/api/photo', {
        method: 'post',
        headers: new Headers({'Authorization': apiKey}),
        body: fd
    })
    .then(res => {
        if (!res.ok) {
            throw Error(response.statusText);
        }
        return res;
    })
    .then(res => {
        uploadFile.value = '';
        uploadDescription.value = '';
        uploadPreview.style.backgroundImage = '';
        uploadLoadingScreen.className = '';
        uploadFieldset.disabled = false;
        navigate('/profile/me');
    })
    .catch(err => {
        alert('Error uploading photo');
    })
});
