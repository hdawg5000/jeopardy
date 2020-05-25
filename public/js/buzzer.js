const socket = io()

let buzzerDisabled = false

document.querySelector('#buzzerForm')
    .addEventListener('submit', (e) => {
        e.preventDefault()
        const name = document.querySelector('input').value
        socket.emit('buzzerPressed', name)

    })

socket.on('buzzerPressed', (name, disableButton) => {
    console.log(`${name} buzzed!`)
    document.querySelector('button').setAttribute('disabled', '')
})

socket.on('resetBuzzer', () => {
    document.querySelector('button').removeAttribute('disabled')
})