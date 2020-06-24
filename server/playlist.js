module.exports = (app, driver) => {
    const session = driver.session()

    app.get('/playlist/:playlistname', (request, result) => {
        let songs = [];
        const playlistname = request.params;
        session
            .run('MATCH (n:Playlist {name: $playlistname}) -[contains]-> (m:YTVideo) RETURN m', playlistname)
            .then((res) => {
                res.records.forEach((record) => {
                    songs.push(record._fields[0].properties);
                });
                result.send(songs);
            })
            .catch((err) => {
                console.log(err);
            });
    });
}