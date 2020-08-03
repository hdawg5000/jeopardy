"use strict";
const adminSocket = io();
const resetBuzzerBtn = document.querySelector('#reset-buzzer');
const timerStartBtn = document.querySelector('#start-timer');
const timerPauseBtn = document.querySelector('#pause-timer');
const timerResetBtn = document.querySelector('#reset-timer');
const playerList = document.querySelector('#player-list');
const playerNameBuzzed = document.getElementById('player-name-buzzed');
const timerElement = document.getElementById('time');
// resetBuzzer.addEventListener('submit', (e: Event) => {
//     e.preventDefault()
//     adminSocket.emit('resetBuzzer')
//     playerNameBuzzed.innerHTML = ''
// })
resetBuzzerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminSocket.emit('resetBuzzer');
    playerNameBuzzed.innerHTML = '';
});
timerStartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('time clicked');
    adminSocket.emit('startTimer');
    playerNameBuzzed.innerHTML = '';
});
timerResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminSocket.emit('resetTimer');
    playerNameBuzzed.innerHTML = '';
});
timerPauseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminSocket.emit('pauseTimer');
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
adminSocket.on('timerUpdate', (time) => {
    timerElement.innerHTML = time.toString();
});
