const socket = io()
const Constants = '../constants/constants'

let buzzerDisabled = false
let playerName = ''
document.querySelector('#buzzerForm').style.display = 'none'

document.querySelector('#name-form')
    .addEventListener('submit', (e) => {
        e.preventDefault()
        playerName = document.querySelector('#name-input').value
        console.log('player', playerName)
        socket.emit('submittedName', playerName)
        document.querySelector('#name-form').style.display = 'none'
        document.querySelector('#buzzerForm').style.display = 'block'
    })

document.querySelector('#buzzerForm')
    .addEventListener('submit', (e) => {
        e.preventDefault()
        socket.emit('buzzerPressed', name)
    })

socket.on('buzzerPressed', (name) => {
    console.log(`${name} buzzed!`)
    document.querySelector('#buzzer-btn').setAttribute('disabled', '')
})

socket.on('resetBuzzer', () => {
    document.querySelector('#buzzer-btn').removeAttribute('disabled')
})