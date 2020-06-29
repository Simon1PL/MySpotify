const bodyParser = require('body-parser');

module.exports = (app, driver) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/changeArtist', (req, result) => {
        const body = req.body;
        let session = driver.session();
        session.run('MATCH (n:YTVideo {videoId: $music.videoId})-[a:share]-(m:Artist) delete a', body)
            .catch((err) => { console.log(err); })
            .then((res) => {
                session = driver.session();
                session.run('MATCH (a:Artist) WHERE NOT (a)-[:share]->() delete a', body)
                    .catch((err) => { console.log(err); })
                    .then(() => {
                        session = driver.session();
                        session.run('MERGE (m:Artist {name: $music.channelTitle})', body)
                        .catch((err) => { console.log(err); })
                        .then((res) => {
                            session = driver.session();
                            session.run('match (n:Artist {name: $music.channelTitle}) match (m:YTVideo {videoId: $music.videoId}) merge (n)-[a:share]->(m)', body)
                                .then((res) => { result.send(); session.close(); })
                                .catch((err) => { console.log(err); session.close(); });
                        });
                    })
            });
    })
};
