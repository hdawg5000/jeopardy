import { ReplaySubject, Observable } from 'rxjs'
import { QUESTIONS } from './game/gameQuestions'

export class GameManager {
    private players: Map<string, string> = new Map()
    private timer: number = 60
    private timerInterval: any
    private questions = QUESTIONS

    private timerSubject: ReplaySubject<number> = new ReplaySubject()
    public timerObs: Observable<number> = this.timerSubject.asObservable()

    public addPlayer(name: string, id: string): void {
        this.players.set(name, id)
    }

    public removePlayer(name: string): void {
        this.players.delete(name)
    }

    public getPlayerNameById(id: string): string {
        let name = ''
        this.players.forEach((value: string, key: string) => {
            if (value === id) {
                name = key
            }
        })
        return name
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

    private updateTimer() {
        if (this.timer === 0) {
            clearInterval(this.timerInterval)
        } else {
            this.timer -= 1
            this.timerSubject.next(this.timer)
        }
    }

    public startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer()
        }, 1000)
    }

    public pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval)
        }
    }

    public resetTimer() {
        clearInterval(this.timerInterval)
        this.timer = 60
        this.timerSubject.next(this.timer)
        this.timerInterval = undefined
    }

    public getQuestions(): Object[] {
        const keys = Object.keys(QUESTIONS[0])
        console.log(keys.map((key) => QUESTIONS.map((v: any) => v[key])))
        return keys.map((key) => QUESTIONS.map((v: any) => v[key]))
    }
}

