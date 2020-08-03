"use strict";
const buzzerSocket = io();
const CONSTANTS = '../constants/constants';
let buzzerDisabled = false;
let playerName = '';
const buzzerButton = document.querySelector('#buzzer-btn');
const buzzerForm = document.querySelector('#buzzerForm');
buzzerForm.style.display = 'none';
const nameForm = document.querySelector('#name-form');
const timeParagraph = document.getElementById('time');
timeParagraph.style.display = 'none';
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerNameInput = document.querySelector('#name-input');
    const playerName = playerNameInput.value;
    console.log('player', playerName);
    buzzerSocket.emit('submittedName', playerName);
    nameForm.style.display = 'none';
    buzzerForm.style.display = 'block';
    timeParagraph.style.display = 'initial';
});
buzzerForm
    .addEventListener('submit', (e) => {
    e.preventDefault();
    buzzerSocket.emit('buzzerPressed', name);
});
buzzerSocket.on('buzzerPressed', (name) => {
    console.log(`${name} buzzed!`);
    buzzerButton.setAttribute('disabled', '');
});
buzzerSocket.on('resetBuzzer', () => {
    buzzerButton.removeAttribute('disabled');
});
buzzerSocket.on('timerUpdate', (time) => {
    timeParagraph.innerHTML = time.toString() + 's';
});
