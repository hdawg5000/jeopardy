const socket = io()

document.querySelector('#controls')
    .addEventListener('submit', (e) => {
        e.preventDefault()

        socket.emit('resetBuzzer')
    })