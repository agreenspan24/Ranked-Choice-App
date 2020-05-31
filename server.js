let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let router = require('./router.js');
let path = require('path');
let api = require('./api.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './client'));
app.use(express.static(path.join(__dirname, './client/dist')));

app.use('/api', api);
app.use('/', router);

module.exports = app;
let port = process.env.PORT || 3001;
app.listen(port, function () {
    console.log('Ranked Choice app is now running on Port ' + port);
});