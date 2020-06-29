const bodyParser = require('body-parser');

module.exports = (app, driver) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/deleteYTVideoFromPlaylist', (req, result) => {
        const body = req.body;

        const session = driver.session();
        session
            .run('match (n:Playlist {name: $playlist})-[a:contains]-(m:YTVideo {videoId: $song.videoId}) delete a', body)
            .then((res) => { result.send(); session.close(); })
            .catch((err) => { console.log(err); session.close(); });
    });
};
