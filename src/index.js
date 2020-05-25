const express = require('express')
const http = require('http')
const io = require('socket.io')

const port = process.env.port || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

}) 

server.listen(port, () => console.log(`listening on port ${port}`))