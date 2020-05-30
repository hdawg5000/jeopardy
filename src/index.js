const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const fs = require('fs')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

let players = new Map()

const port = process.env.port || 3000

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('New connection', socket.id)

    socket.on('submittedName', (name) => {
        console.log('name', name)
        players.set(socket.id, name)
        fs.appendFile('src/users.txt', `${name},${socket.id}`, () => console.log('success'))
    })

    socket.on('sendMessage', (message, callback) => {
        io.emit('incomingMessage', message)
        callback()
    })

    socket.on('buzzerPressed', () => {
        const name = players.get(socket.id)
        buzzed(name)
    })

    socket.on('resetBuzzer', () => {
        resetBuzzer()
    })
})

server.listen(port, () => console.log(`listening on port ${port}`))

function buzzed(name) {
    console.log('emitting', name)
    io.emit('buzzerPressed', name)
}

function resetBuzzer() {
    io.emit('resetBuzzer')
}