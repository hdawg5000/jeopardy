"use strict";
// export {}
let adminSocket = io();
const controls = document.querySelector('#controls');
controls.addEventListener('submit', (e) => {
    e.preventDefault();
    adminSocket.emit('resetBuzzer');
});
adminSocket.on('connect', () => {
    adminSocket.emit('adminConnected');
});
adminSocket.on('userLeft', (name) => {
    console.log(name, 'left');
});
adminSocket.on('buzzerPressed', (name) => {
    const p = document.querySelector('#player-name-buzzed');
    p.setAttribute('textContent', `${name} buzzed!`);
});
adminSocket.on('userConnected', (players) => {
    const list = document.querySelector('#player-list');
    while (list.firstChild)
        list.firstChild.remove();
    console.log(players);
    players.forEach(player => {
        let li = document.createElement('li');
        li.textContent = `${player.name} (${player.id})\n`;
        list.appendChild(li);
    });
});
adminSocket.on('connectedPlayers', (players) => {
    console.log('connected', players);
    players.map((player) => {
        let li = document.createElement('li');
        li.textContent = `${player.name} (${player.id})\n`;
        const list = document.querySelector('#player-list');
        list.appendChild(li);
    });
});
