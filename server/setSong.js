const bodyParser = require('body-parser');

module.exports = (app, driver) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/setSong', (req, result) => {
        const body = req.body;
        let session = driver.session();
        session.run('MATCH (n:YTVideo {videoId: $song.videoId}) SET n = $song', body)
            .then((res) => { result.send(); session.close(); })
            .catch((err) => { console.log(err); session.close(); });
    });
};
