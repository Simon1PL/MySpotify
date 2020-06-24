module.exports = (app, driver) => {
    const session = driver.session()
    let songs = [];
    session
        .run('MATCH (n:YTVideo) RETURN n')
        .then((res) => {
            res.records.forEach((record) => {
            songs.push(record._fields[0].properties);
            });
            session.close();
        })
        .catch((err) => {
            console.log(err);
            session.close();
        });

    app.get('/songs', (req, res) => {
        res.send(songs);
    });

    app.get('/songs/:text', (req, res) => {
        res.send(songs.filter(song =>
            song.title.toLowerCase().includes(req.params.text.toLowerCase()) ||
            song.channelTitle.toLowerCase().includes(req.params.text.toLowerCase())));
    });
};
