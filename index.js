var express = require('express')
var http = require('http')
var https = require('https')
var fs = require('fs')
var ip = require('ip').address()
var app = express()
var io = new (require('socket.io'))()
var request = require('request')

var key = fs.readFileSync('config/ssl.key')
var cert = fs.readFileSync('config/ssl.crt')
var ports = process.env.PORT ? [process.env.PORT] : [8080, 8443]

app.config = require('lighter-config')
app.use(require('body-parser').json())
global.app = app
global.io = io
global.log = require('cedar')()

ports.forEach(function (port, ssl) {
  var server = ssl
    ? https.createServer({key: key, cert: cert}, app)
    : http.createServer(app)

  server.listen(port, function () {
    var protocol = ssl ? 'https:' : 'http:'
    log('Listening at ' + (protocol + '//' + ip + ':' + port + '/').cyan)
  })
  io.attach(server)
})

app.get('/thing/*', function (req, res) {
  var url = req.url.replace(/^\/[a-z]+/, 'https://cdn.thingiverse.com')
  request.get(url).pipe(res)
})

clients = []
require('./lib/state')
require('./lib/errors')
require('./lib/io')
require('./lib/alexa')
var load = require('./lib/load')
