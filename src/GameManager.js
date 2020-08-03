"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const rxjs_1 = require("rxjs");
class GameManager {
    constructor() {
        this.players = new Map();
        this.timer = 60;
        this.timerSubject = new rxjs_1.ReplaySubject();
        this.timerObs = this.timerSubject.asObservable();
    }
    addPlayer(name, id) {
        this.players.set(name, id);
    }
    removePlayer(name) {
        this.players.delete(name);
    }
    getPlayerNameById(id) {
        let name = '';
        this.players.forEach((value, key) => {
            if (value === id) {
                name = key;
            }
        });
        return name;
    }
    getAllPlayers() {
        let p = new Array();
        this.players
            .forEach((value, key) => {
            const player = { 'name': key, 'id': value };
            p.push(player);
        });
        return p;
    }
    updateTimer() {
        if (this.timer === 0) {
            clearInterval(this.timerInterval);
        }
        else {
            this.timer -= 1;
            this.timerSubject.next(this.timer);
        }
    }
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
    resetTimer() {
        clearInterval(this.timerInterval);
        this.timer = 60;
        this.timerSubject.next(this.timer);
        this.timerInterval = undefined;
    }
}
exports.GameManager = GameManager;
