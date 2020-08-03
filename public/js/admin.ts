const adminSocket: SocketIOClient.Socket = io()

const resetBuzzerBtn: HTMLFormElement = <HTMLFormElement>document.querySelector('#reset-buzzer')
const timerStartBtn: HTMLFormElement = <HTMLFormElement>document.querySelector('#start-timer')
const timerPauseBtn: HTMLFormElement = <HTMLFormElement>document.querySelector('#pause-timer')
const timerResetBtn: HTMLFormElement = <HTMLFormElement>document.querySelector('#reset-timer')


const playerList: HTMLUListElement = <HTMLUListElement>document.querySelector('#player-list')
const playerNameBuzzed: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('player-name-buzzed')
const timerElement: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('time')
// resetBuzzer.addEventListener('submit', (e: Event) => {
//     e.preventDefault()
//     adminSocket.emit('resetBuzzer')
//     playerNameBuzzed.innerHTML = ''
// })

resetBuzzerBtn.addEventListener('click', (e: Event) => {
    e.preventDefault()
    adminSocket.emit('resetBuzzer')
    playerNameBuzzed.innerHTML = ''
})

timerStartBtn.addEventListener('click', (e: Event) => {
    e.preventDefault()
    adminSocket.emit('startTimer')
    playerNameBuzzed.innerHTML = ''
})
timerResetBtn.addEventListener('click', (e: Event) => {
    e.preventDefault()
    adminSocket.emit('resetTimer')
    playerNameBuzzed.innerHTML = ''
})
timerPauseBtn.addEventListener('click', (e: Event) => {
    e.preventDefault()
    adminSocket.emit('pauseTimer')
    playerNameBuzzed.innerHTML = ''
})

adminSocket.on('connect', () => {
    adminSocket.emit('adminConnected')
})

adminSocket.on('userLeft', (players: { name: string, id: string }[]) => {
    while (playerList.firstChild) playerList.firstChild.remove()
    players.forEach(player => {
        let li = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        playerList.appendChild(li)
    })
})

adminSocket.on('buzzerPressed', (name: string) => {
    playerNameBuzzed.innerHTML = `${name} buzzed!`
})

adminSocket.on('userConnected', (players: { name: string, id: string }[]) => {
    while (playerList.firstChild) playerList.firstChild.remove()
    players.forEach(player => {
        let li = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        playerList.appendChild(li)
    })
})

adminSocket.on('connectedPlayers', (players: { name: string, id: string }[]) => {
    players.map((player: { name: string, id: string }) => {
        let li: HTMLLIElement = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        const list = <HTMLUListElement>document.querySelector('#player-list')
        list.appendChild(li)
    })
})

adminSocket.on('timerUpdate', (time: number) => {
    timerElement.innerHTML = time.toString()
})