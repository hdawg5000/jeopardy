const socket = io()

document.querySelector('#controls')
    .addEventListener('submit', (e) => {
        e.preventDefault()

        socket.emit('resetBuzzer')
    })

socket.on('connect', () => {
    socket.emit('adminConnected')
})

socket.on('userLeft', (name) => {
    console.log(name, 'left')
})

socket.on('buzzerPressed', (name) => {
    document.querySelector('#player-name-buzzed').setAttribute(textContent, `${name} buzzed!`)
})

socket.on('userConnected', (name, socketId) => {
    console.log(name, socketId)
    let li = document.createElement('li')
    li.textContent = `${name} (${socketId})\n`
    document.querySelector('#player-list')
        .appendChild(li)
})

socket.on('connectedPlayers', (players) => {
    console.log('connected', players.keys)
    // players.keys().map(key => {
    //     let li = document.createElement('li')
    //     li.textContent = `${players.get(key)} (${key})\n`
    //     document.querySelector('#player-list')
    //         .appendChild(li)
    // })
})