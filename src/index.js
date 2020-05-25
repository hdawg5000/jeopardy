const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.port || 3000

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('New connection')

    socket.on('sendMessage', (message, callback) => {
        io.emit('incomingMessage', message)
        callback()
    })

    socket.on('buzzerPressed', (name) => {
        buzzed(name)
    })

    socket.on('resetBuzzer', () => {
        resetBuzzer()
    })
})

server.listen(port, () => console.log(`listening on port ${port}`))

function buzzed(name) {
    io.emit('buzzerPressed', name, true)
}

function resetBuzzer() {
    io.emit('resetBuzzer')
}