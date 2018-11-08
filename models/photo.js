const photos = {};
let lastId = 0;

exports.create = (userId, description, path) => {
    const photo = {
        user: userId,
        description: description,
        date: Date.now(),
        path: path
    };
    let id = lastId;
    photos[id] = photo;
    lastId ++;
    return {
        id: id,
        ...photo
    };
};

exports.get = (id) => {
    if (!photos[id]) {
        return null;
    }
    return {
        id: id,
        ...photos[id]
    };
};

exports.getAllByUser = (userId) => {
    let matches = [];
    for (let id in photos) {
        if (photos[id].user === userId) {
            matches.push({
                id: Number(id),
                ...photos[id]
            })
        }
    }
    return matches;
};

exports.getAllByUsers = (ids, dateFrom) => {
    let feed = [];
    for (let id in photos) {
        if (ids.indexOf(photos[id].user) !== -1 &&
            dateFrom <= photos[id].date) {
            feed.push({
                id: Number(id),
                ...photos[id]
            });
        }
    }
    // Sort photos in reverse data order (latest first)
    feed.reverse();
    feed.sort((a,b) => b.date - a.date);
    return feed;
};

