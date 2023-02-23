var express = require('express')
var path = require('path');

var app = express()
var port = process.env.port || 8080;


app.use(express.static('build'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname + '/build/index.html')));

app.listen(port, () => {
    console.log(`AI client listening on port: ${port}`)
})