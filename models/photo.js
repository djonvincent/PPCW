const photos =[];
let lastPhotoId = 0;

exports.create = (username, description, path) => {
    const photo = {
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
    const matches = photos.filter(
        photo => photo.user === username
    ).map((photo) => {
        const {user, ...rest} = photo;
        return rest;
    });
    return matches;
};

