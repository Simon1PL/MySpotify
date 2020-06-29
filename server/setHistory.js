const bodyParser = require('body-parser');

module.exports = (app, driver) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/setHistory', (req, result) => {
        const body = req.body;
        let session = driver.session();
        session.run('MERGE (n:History) SET n=$history', body)
            .then((res) => { result.send(); session.close(); })
            .catch((err) => { console.log(err); session.close(); });
    });
};
