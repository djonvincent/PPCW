function timeDeltaFormat(date) {
    let now = new Date();
    let d = now - date;
    d /= 1000;
    if (d < 60) {
        return 'Just now';
    }
    d /= 60;
    if (d < 2) {
        return 'A minute ago';
    }
    if (d < 60) {
        return Math.floor(d) + ' minutes ago';
    }
    d /= 60;
    if (d < 2) {
        return 'An hour ago';
    }
    if (d < 24) { 
        return Math.floor(d) + ' hours ago';
    }
    d /= 24;
    if (d < 2) {
        return 'Yesterday';
    }
    if (d < 7) {
        return Math.floor(d) + ' days ago';
    }
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    let dateString = monthNames[date.getMonth()] + ' ' + date.getDate();
    if (now.getFullYear() !== date.getFullYear()) {
        dateString += ', ' + date.getFullYear();
    }
    return dateString;
}

function updateLikeStatus(id, like) {
    let method = 'post';
    if (like === false) {
        method = 'delete';
    }
    let apiKey = localStorage.getItem('apiKey');
    return fetch('/photo/' + id + '/like', {
        method: method,
        headers: new Headers({'Authorization': apiKey})
    })
    .then(res => {
        if (!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    })
}

