const bodyParser = require('body-parser');

module.exports = (app, driver) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/addYTVideoToPlaylist', (req, res) => {
        const body = req.body;

        let session = driver.session();
        session.run('MERGE (n:YTVideo {videoId: $song.videoId}) ON CREATE SET n=$song', body)
        .catch((err) => { console.log(err); });
        session = driver.session();
        session.run('MERGE (m:Playlist {name: $playlist})', body)
        .catch((err) => { console.log(err); });
        session = driver.session();
        session
            .run('match (n:Playlist {name: $playlist}) match (m:YTVideo {videoId: $song.videoId}) merge (n)-[a:contains]->(m)', body)
            .then((res) => { session.close(); })
            .catch((err) => { console.log(err); session.close(); });
    });
};
