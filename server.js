'use strict';

const app = require('express')()
const server = require('http').createServer(app)
// const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000


app.get('/', (req, res) => {
    res.send('heard dat!')
})

server.listen(PORT, () => {
    console.log(`this here server listening on port: ${PORT}`)
})

