module.exports = (app, driver) => {
    const session = driver.session()

    app.get('/playlists', (request, result) => {
        let playlists = [];
        session
            .run('MATCH (n:Playlist) RETURN n')
            .then((res) => {
                res.records.forEach((record) => {
                    playlists.push(record._fields[0].properties);
                });
                result.send(playlists);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
