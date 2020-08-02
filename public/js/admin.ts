const adminSocket: SocketIOClient.Socket = io()

const controls: HTMLFormElement = <HTMLFormElement>document.querySelector('#controls')
controls.addEventListener('submit', (e) => {
    e.preventDefault()

    adminSocket.emit('resetBuzzer')
})

adminSocket.on('connect', () => {
    adminSocket.emit('adminConnected')
})

adminSocket.on('userLeft', (name: string) => {
    console.log(name, 'left')
})

adminSocket.on('buzzerPressed', (name: string) => {
    const p: HTMLParagraphElement = <HTMLParagraphElement>document.querySelector('#player-name-buzzed')
    p.setAttribute('textContent', `${name} buzzed!`)
})

adminSocket.on('userConnected', (players: { name: string, id: string }[]) => {
    const list: HTMLUListElement = <HTMLUListElement>document.querySelector('#player-list')
    while (list.firstChild) list.firstChild.remove()
    console.log(players)
    players.forEach(player => {
        let li = document.createElement('li')
        li.textContent = `${player.name} (${player.id})\n`
        list.appendChild(li)
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