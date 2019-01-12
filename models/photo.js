const photos =[];
let lastPhotoId = 0;

exports.create = (username, description, path) => {
    let photo = {
        id: lastPhotoId,
        user: username,
        description: description,
        date: Date.now(),
        path: path
    };
    lastPhotoId ++;
    photos.push(photo);
    return photo;
};

exports.get = (id) => {
    for (let photo of photos) {
        if (photo.id === id) {
            return photo;
        }
    }
    return null;
};

exports.getAllByUser = (username) => {
    let matches = photos.filter(
        photo => photo.user === username
    ).map((photo) => {
        let {user, ...rest} = photo;
        return rest;
    });
    return matches;
};

exports.getFeed = (usernames, dateFrom) => {
    let feed = [];
    for (let i = photos.length-1; i >= 0; i--) {
        if (usernames.indexOf(photos[i].user) !== -1 &&
            dateFrom <= photos[i].date) {
            feed.push(photos[i]);
        }
    }
    // Sort photos in reverse data order (latest first)
    feed.sort((a,b) => b.date - a.date);
    return feed;
};

