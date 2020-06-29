module.exports = (app, driver) => {
    const session = driver.session()

    app.get('/artist/:artistname', (request, result) => {
        let songs = [];
        const artistname = request.params;
        session
            .run('MATCH (n:Artist {name: $artistname}) -[share]-> (m:YTVideo) RETURN m', artistname)
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