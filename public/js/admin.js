"use strict";
const adminSocket = io();
const controls = document.querySelector('#controls');
const playerList = document.querySelector('#player-list');
const playerNameBuzzed = document.getElementById('player-name-buzzed');
controls.addEventListener('submit', (e) => {
    e.preventDefault();
    adminSocket.emit('resetBuzzer');
    playerNameBuzzed.innerHTML = '';
});
adminSocket.on('connect', () => {
    adminSocket.emit('adminConnected');
});
adminSocket.on('userLeft', (players) => {
    while (playerList.firstChild)
        playerList.firstChild.remove();
    players.forEach(player => {
        let li = document.createElement('li');
        li.textContent = `${player.name} (${player.id})\n`;
        playerList.appendChild(li);
    });
});
adminSocket.on('buzzerPressed', (name) => {
    console.log('buzzer pressed', name);
    playerNameBuzzed.innerHTML = `${name} buzzed!`;
});
adminSocket.on('userConnected', (players) => {
    while (playerList.firstChild)
        playerList.firstChild.remove();
    console.log(players);
    players.forEach(player => {
        let li = document.createElement('li');
        li.textContent = `${player.name} (${player.id})\n`;
        playerList.appendChild(li);
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
