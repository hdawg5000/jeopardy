"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const gameManager_1 = require("./gameManager");
const gameQuestions_1 = require("./game/gameQuestions");
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const handlebars = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const manager = new gameManager_1.GameManager();
const questions = gameQuestions_1.QUESTIONS;
const app = express();
const server = http.createServer(app);
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
// app.use(express.static(path.join(publicDirectoryPath, 'views')))
const io = socketio(server, {
    pingInterval: 10000,
    pingTimeout: 60000,
});
const publicDirectoryPath = path.join(__dirname, 'public');
console.log(publicDirectoryPath);
let adminSocketId = '';
app.engine('hbs', handlebars({
    layoutsDir: publicDirectoryPath + '/views',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(publicDirectoryPath, 'views'));
app.use(express.static(publicDirectoryPath));
const port = process.env.port || 3000;
app.get('/', (req, res) => {
    res.render('main', { questions: questions });
    // res.sendFile(publicDirectoryPath + '/index.html')
});
app.get('/buzzer', (req, res) => {
    res.sendFile(publicDirectoryPath + '/buzzer.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(publicDirectoryPath + '/admin.html');
});
io.on('connection', (socket) => {
    console.log('New connection', socket.id);
    socket.on('submittedName', (name) => {
        console.log('name', name);
        manager.addPlayer(name, socket.id);
        io.to(adminSocketId).emit('userConnected', manager.getAllPlayers());
    });
    socket.on('sendMessage', (message, callback) => {
        io.emit('incomingMessage', message);
        callback();
    });
    socket.on('buzzerPressed', () => {
        const name = manager.getPlayerNameById(socket.id) || '';
        buzzed(name);
    });
    socket.on('resetBuzzer', () => {
        resetBuzzer();
        manager.resetTimer();
    });
    socket.on('startTimer', () => {
        console.log('start timer server');
        manager.startTimer();
        manager.timerObs
            .subscribe((time) => {
            console.log(time);
            io.emit('timerUpdate', time);
        });
    });
    socket.on('pauseTimer', () => {
        console.log('reset server');
        manager.pauseTimer();
    });
    socket.on('resetTimer', () => {
        console.log('reset server');
        manager.resetTimer();
    });
    socket.on('disconnect', (reason) => {
        console.log('reason', reason);
        if (reason === 'transport close') {
            const name = manager.getPlayerNameById(socket.id);
            console.log(name);
            if (name) {
                manager.removePlayer(name);
                io.to(adminSocketId).emit('userLeft', manager.getAllPlayers());
                console.log(name, 'left');
            }
        }
        if (reason === 'client namespace disconnect') {
            console.log('reason', reason);
        }
    });
    socket.on('adminConnected', () => {
        adminSocketId = socket.id;
        // console.log('admin connected', players.keys.length)
        // let players = []
        // for (const [key, value] of manager.getAllPlayers()) {
        //     players.push({ 'name': player[0], 'id': player[1] })
        // }
        // manager.getAllPlayers().forEach(player => players.push({ 'name': player[0], 'id': player[1] }))
        io.to(adminSocketId).emit('connectedPlayers', manager.getAllPlayers());
    });
});
server.listen(port, () => console.log(`listening on port ${port}`));
function buzzed(name) {
    console.log('emitting', name);
    io.emit('buzzerPressed', name);
    io.to(adminSocketId).emit('buzzerPressed', name);
    manager.pauseTimer();
}
function resetBuzzer() {
    console.log('resetting from server');
    io.emit('resetBuzzer');
}
function startTimer() {
    // manager.timerObs
    //     .subscribe((time: number) => {
    //     })
}
