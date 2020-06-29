module.exports = (app, driver) => {

    app.get('/songPlaylists/:songId', (req, result) => {
        const session = driver.session()
        let playlists = [];
        session
            .run('MATCH (p:YTVideo {videoId: $songId}) MATCH (p)-[r:contains]-(a) return a', req.params)
            .then((res) => {
                res.records.forEach((record) => {
                    playlists.push(record._fields[0].properties);
                });
                result.send(playlists);
                session.close();
            })
            .catch((err) => {
                console.log(err);
                session.close();
            });
    });
};
