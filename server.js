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
