let uploadFile = document.getElementById('uploadFile');
let uploadDescription = document.getElementById('uploadDescription');
let uploadButton = document.getElementById('uploadButton');
let uploadPreview = document.getElementById('uploadPreview');
let uploadForm = document.getElementById('uploadForm');
let uploadFieldSet = document.getElementById('uploadFieldset');
let uploadChooseFileButton = document.getElementById('uploadChooseFileButton');
let uploadLoadingScreen = document.getElementById('uploadLoadingScreen');
let uploadFileObject;

uploadChooseFileButton.addEventListener('click', () => {
    uploadFile.click();
});

uploadFile.addEventListener('change', () => {
	if (!uploadFile.files) {
		return;
	}
    let filename = uploadFile.files[0].name;
    let dotIndex = filename.indexOf('.');
    let extension = filename.substring(dotIndex+1).toLowerCase();
    let validExtensions = [
        'jpg',
        'jpeg',
        'png',
        'bmp',
        'gif',
    ];
    if (dotIndex === -1 || validExtensions.indexOf(extension) === -1) {
        alert('Invalid image file format');
        return;
    }

    let reader = new FileReader();
    reader.addEventListener('load', e => {
        uploadPreview.style.backgroundImage = `url(${e.target.result})`;
    });
    reader.readAsDataURL(uploadFile.files[0]);
    uploadFileObject = uploadFile.files[0];
    uploadButton.disabled = false;

});

uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    let apiKey = localStorage.getItem('apiKey');
    if (!uploadFileObject) {
        return;
    }
    let fd = new FormData();
    fd.append('photo', uploadFileObject);
    fd.append('description', uploadDescription.value);
    uploadLoadingScreen.classList.add('loading');
    uploadFieldset.disabled = true;
    fetch('/photo', {
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
