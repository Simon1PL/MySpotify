module.exports = (app, driver) => {
    app.get('/songs', (req, result) => {
        const session = driver.session()
        let songs = [];
        session
            .run('MATCH (n:YTVideo) RETURN n')
            .then((res) => {
                res.records.forEach((record) => {
                    songs.push(record._fields[0].properties);
                });
                result.send(songs);
                session.close();
            })
            .catch((err) => {
                console.log(err);
                session.close();
            });
    });

    app.get('/songs/:text', (req, result) => {
        const session = driver.session()
        let songs = [];
        session
            .run('MATCH (n:YTVideo) RETURN n')
            .then((res) => {
                res.records.forEach((record) => {
                    songs.push(record._fields[0].properties);
                });
                result.send(songs.filter(song =>
                    song.title.toLowerCase().includes(req.params.text.toLowerCase()) ||
                    song.channelTitle.toLowerCase().includes(req.params.text.toLowerCase())));
                session.close();
            })
            .catch((err) => {
                console.log(err);
                session.close();
            });
    });
};
