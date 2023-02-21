var express = require('express')

var app = express()
var port = process.env.port || 3000;

app.use(express.static('build'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname + '/build/index.html')));

app.listen(port, () => {
    console.log(`AI client listening on port: ${port}`)
})