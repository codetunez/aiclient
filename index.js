// This www server can be used instead of npm run start
var express = require('express')

var app = express()
var port = 8080

app.use(express.static('build'));
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname + '/build/index.html')));

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})
