'use strict';

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const ws = require('socket.io')(server)

const PORT = process.env.PORT || 3000

app.set('view engine', 'jade')

app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index')
})

server.listen(PORT, () => {
    console.log(`this here server listening on port: ${PORT}`)
})

// subscribe to events here. event is connection. a client is connecting to node
ws.on('connection', socket => {
    console.log('connection heeerrree*******', socket);
})
