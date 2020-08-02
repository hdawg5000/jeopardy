"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
class GameManager {
    constructor() {
        this.players = new Map();
    }
    addPlayer(name, id) {
        this.players.set(name, id);
        console.log('manager', this.players.entries());
    }
    removePlayer(name) {
        this.players.delete(name);
        console.log('deleted', name);
        console.log('d', this.players.keys());
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
}
exports.GameManager = GameManager;
