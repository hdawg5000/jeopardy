import express = require('express')
import { GameManager } from './gameManager';
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;

const manager = new GameManager()
const app: express.Application = express()
const server = http.createServer(app)
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const io = socketio(server, {
    pingInterval: 10000, // default - 25000
    pingTimeout: 60000, // default - 60000
})

const publicDirectoryPath = path.join(__dirname, '../public')
let adminSocketId = ''

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

io.on('connection', (socket: SocketIO.Socket) => {
    console.log('New connection', socket.id)

    socket.on('submittedName', (name) => {
        console.log('name', name)
        manager.addPlayer(name, socket.id)

        io.to(adminSocketId).emit('userConnected', manager.getAllPlayers())
    })

    socket.on('sendMessage', (message, callback) => {
        io.emit('incomingMessage', message)
        callback()
    })

    socket.on('buzzerPressed', () => {
        const name: string = manager.getPlayerNameById(socket.id) || ''
        buzzed(name)
    })

    socket.on('resetBuzzer', () => {
        resetBuzzer()
    })
    socket.on('startTimer', () => {
        console.log('start timer server')
        manager.startTimer()
        manager.timerObs
            .subscribe((time: number) => {
                console.log(time)
                io.emit('timerUpdate', time)
            })
    })
    socket.on('pauseTimer', () => {
        console.log('reset server')
        manager.pauseTimer()
    })
    socket.on('resetTimer', () => {
        console.log('reset server')
        manager.resetTimer()
    })

    socket.on('disconnect', (reason) => {
        console.log('reason', reason)
        if (reason === 'transport close') {
            const name = manager.getPlayerNameById(socket.id)
            console.log(name)
            if (name) {
                manager.removePlayer(name)
                io.to(adminSocketId).emit('userLeft', manager.getAllPlayers())
                console.log(name, 'left')
            }
        }
        if (reason === 'client namespace disconnect') {
            console.log('reason', reason)
        }
    })

    socket.on('adminConnected', () => {
        adminSocketId = socket.id
        // console.log('admin connected', players.keys.length)
        // let players = []

        // for (const [key, value] of manager.getAllPlayers()) {
        //     players.push({ 'name': player[0], 'id': player[1] })
        // }
        // manager.getAllPlayers().forEach(player => players.push({ 'name': player[0], 'id': player[1] }))
        io.to(adminSocketId).emit('connectedPlayers', manager.getAllPlayers())
    })
})

server.listen(port, () => console.log(`listening on port ${port}`))

function buzzed(name: string) {
    console.log('emitting', name)
    io.emit('buzzerPressed', name)
    io.to(adminSocketId).emit('buzzerPressed', name)
    manager.pauseTimer()
}

function resetBuzzer() {
    console.log('resetting from server')
    io.emit('resetBuzzer')
}

function startTimer() {
    // manager.timerObs
    //     .subscribe((time: number) => {

    //     })
}