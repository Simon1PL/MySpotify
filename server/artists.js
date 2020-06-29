module.exports = (app, driver) => {
    const session = driver.session()

    app.get('/artists', (request, result) => {
        let artists = [];
        session
            .run('MATCH (n:Artist) RETURN n')
            .then((res) => {
                res.records.forEach((record) => {
                    artists.push(record._fields[0].properties);
                });
                result.send(artists);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
