

// NOTE: branch3 is the only working branch for the chat app. master has branch5 merged in and it does not work.



'use strict';

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const ws = require('socket.io')(server)
const pg = require('pg')

const PORT = process.env.PORT || 3000
const POSTGRES_URL = process.env.POSTGRES_URL
  || 'postgres://localhost:5432/nodeWebSockets'

const db = new pg.Client(POSTGRES_URL)

app.set('view engine', 'jade')

app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index')
})
// testing
// app.get('/chats', (req, res) => {
//     db.query('SELECT * FROM chats', (err, result) => {
//         if (err) throw err

//         res.send(result.rows)
//     })
// })


db.connect((err) => {
    if (err) throw err

    server.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`)
    })
})



// subscribe to events here. event is connection. a client is connecting to node
ws.on('connection', socket => {
    console.log('socket connected', socket.id)

    // showing saved chats
    db.query('SELECT * FROM chats', (err, result) => {
        if (err) throw err

        socket.emit('receiveChat', result.rows)
    })


    // listen for new chats
    // here we are putting the object msg, into an array [msg]....in case there were multiple messages
    // scott said he likes to save to the db before he broadcasts it to the users
                // broadcast.emit will emit it to everyone but this socket
                // socket.emit will emit to your socket
    socket.on('sendChat', msg => {
        db.query('INSERT INTO chats (name, text) VALUES ($1, $2)',
            [msg.name, msg.text], (err) => {
                if (err) throw err;

                socket.broadcast.emit('receiveChat', [msg])
        })
    })
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
