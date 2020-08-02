const buzzerSocket: SocketIOClient.Socket = io()
const CONSTANTS = '../constants/constants'

let buzzerDisabled = false
let playerName = ''
const buzzerButton: HTMLButtonElement = <HTMLButtonElement>document.querySelector('#buzzer-btn')
const buzzerForm: HTMLFormElement = <HTMLFormElement>document.querySelector('#buzzerForm')
buzzerForm.style.display = 'none'

const nameForm: HTMLFormElement = <HTMLFormElement>document.querySelector('#name-form')
nameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const playerNameInput: HTMLInputElement = <HTMLInputElement>document.querySelector('#name-input')
    const playerName: string = playerNameInput.value
    console.log('player', playerName)
    buzzerSocket.emit('submittedName', playerName)
    nameForm.style.display = 'none'
    buzzerForm.style.display = 'block'
})

buzzerForm
    .addEventListener('submit', (e) => {
        e.preventDefault()
        buzzerSocket.emit('buzzerPressed', name)
    })

buzzerSocket.on('buzzerPressed', (name: string) => {
    console.log(`${name} buzzed!`)
    buzzerButton.setAttribute('disabled', '')
})

buzzerSocket.on('resetBuzzer', () => {
    buzzerButton.removeAttribute('disabled')
})