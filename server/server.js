const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neopassword')
);

const app = express();
app.use(express.static(path.join(__dirname, '../dist/my-spotify')));

require('./songs')(app, driver);
require('./playlists')(app, driver);
require('./playlist')(app, driver);
require('./addYTVideoToPlaylist')(app, driver);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/my-spotify/index.html'));
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

// driver.close();
