const express = require('express');
const path = require('path');
const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
    'bolt://hobby-fgmnaacjcnamgbkepkeibfel.dbs.graphenedb.com:24787',
    neo4j.auth.basic('myspotify', 'b.0jAqt3mxh6BA.JAm8K82NiIoTnyyn'),
    { encrypted : true}
/*     'bolt://localhost',
    neo4j.auth.basic('neo4j', 'neopassword') */
);

const app = express();
app.use(express.static(path.join(__dirname, '../dist/my-spotify')));

require('./songs')(app, driver);
require('./playlists')(app, driver);
require('./playlist')(app, driver);
require('./artists')(app, driver);
require('./artist')(app, driver);
require('./getHistory')(app, driver);
require('./setHistory')(app, driver);
require('./changeArtist')(app, driver);
require('./addYTVideoToPlaylist')(app, driver);
require('./songPlaylists')(app, driver);
require('./setSong')(app, driver);
require('./deleteYTVideoFromPlaylist')(app, driver);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/my-spotify/index.html'));
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

// driver.close();
