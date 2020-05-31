const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    pingInterval: 10000, // default - 25000
    pingTimeout: 60000, // default - 60000
})

let players = new Map()
const publicDirectoryPath = path.join(__dirname, '../public')
let gameManagerSocketId = ''

const port = process.env.port || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(publicDirectoryPath + '/index.html')
})

app.get('/buzzer', (req, res) => {
    res.sendFile(publicDirectoryPath + '/buzzer.html')
})

app.get('/admin', (req, res) => {
    res.sendFile(publicDirectoryPath + '/admin.html')
})

io.on('connection', (socket) => {
    console.log('New connection', socket.id, players.keys)

    socket.on('submittedName', (name) => {
        console.log('name', name)
        players.set(socket.id, name)
        console.log(players.keys().length)

        io.to(gameManagerSocketId).emit('userConnected', name, socket.id)
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

    socket.on('disconnect', (reason) => {
        console.log('reason', reason)
        if (reason === 'transport close') {
            const name = players.get(socket.id)
            if (name) {
                io.to(gameManagerSocketId).emit('userLeft', name)
            }
            console.log(name, 'left')
        }
        if (reason === 'client namespace disconnect') {
            console.log('reason', reason)
        }
    })

    socket.on('adminConnected', () => {
        gameManagerSocketId = socket.id
        console.log('admin connected', players.keys.length)
        io.to(gameManagerSocketId).emit('connectedPlayers', players)
    })
})

server.listen(port, () => console.log(`listening on port ${port}`))

function buzzed(name) {
    console.log('emitting', name)
    io.emit('buzzerPressed', name)
}

function resetBuzzer() {
    console.log('resetting from server')
    io.emit('resetBuzzer')
}