const adminSocket: SocketIOClient.Socket = io()

const controls: HTMLFormElement = <HTMLFormElement>document.querySelector('#controls')
const playerList: HTMLUListElement = <HTMLUListElement>document.querySelector('#player-list')
const playerNameBuzzed: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById('player-name-buzzed')


controls.addEventListener('submit', (e) => {
    e.preventDefault()

    adminSocket.emit('resetBuzzer')
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
    console.log('buzzer pressed', name)
    playerNameBuzzed.innerHTML = `${name} buzzed!`
})

adminSocket.on('userConnected', (players: { name: string, id: string }[]) => {
    while (playerList.firstChild) playerList.firstChild.remove()
    console.log(players)
    players.forEach(player => {
        let li = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        playerList.appendChild(li)
    })
})

adminSocket.on('connectedPlayers', (players: { name: string, id: string }[]) => {
    console.log('connected', players)
    players.map((player: { name: string, id: string }) => {
        let li: HTMLLIElement = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        const list = <HTMLUListElement>document.querySelector('#player-list')
        list.appendChild(li)
    })
})