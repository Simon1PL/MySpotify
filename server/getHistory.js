module.exports = (app, driver) => {
    const session = driver.session()

    app.get('/getHistory', (request, result) => {
        let history;
        session
            .run('MATCH (n:History) RETURN n')
            .then((res) => {
                history = res.records[0]._fields[0].properties;
                result.send(history);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};
