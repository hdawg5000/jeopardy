export class GameManager {
    private players: Map<string, string> = new Map()
    public addPlayer(name: string, id: string): void {
        this.players.set(name, id)
        console.log('manager', this.players.entries())
    }

    public removePlayer(name: string): void {
        this.players.delete(name)
    }

    public getAllPlayers(): { name: string, id: string }[] {
        let p: any[] = new Array()
        this.players
            .forEach((value: string, key: string) => {
                const player = { 'name': key, 'id': value }
                p.push(player)
            })
        return p
    }
}

