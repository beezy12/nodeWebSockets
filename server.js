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

// websockets use a publish / subscribe pattern
// subscribe to events here. event is 'connection'. a client is connecting to node
ws.on('connection', socket => {
    // console.log('server.js connection heeerrree*******');

    // here is where I am receiving the data sent by main.js
    // once this server receives an event, it can save it to the db
    socket.on('sendChat', (msg) => {
        console.log('this is the msg that is being sent through server.js', msg)
        // server has heard the message and is emitting it to everyone else over the server
        // so now the client in main.js has to listen for this
        socket.broadcast.emit('receiveChat', msg)
    })
})
