import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'
import fire from '../fire'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.lastPerson = ''
        this.leaderboard = []
    }

    connectDatabase () {
        fire.database().ref('weeklyLeaderboard/Computer Science/Overall').orderByValue().on('child_added', snapshot => {
            this.leaderboard.push({
                uid: snapshot.key,
                score: snapshot.val()
            })
            this.emit('change')
            console.log(this.leaderboard)
        })
    }

    loadLeaderboard (leaderboard) {
        this.leaderboard = leaderboard
        this.emit('change')
    }

    getAll () {
        return (this.leaderboard)
    }

    handleActions (action) {
        switch (action.type) {
        case 'LOAD_LEADERBOARD': {
            this.loadLeaderboard(action.leaderboard)
            break
        }
        default:
        }
    }
}

const liveLeaderboardStore = new LiveLeaderboardStore()
dispatcher.register(liveLeaderboardStore.handleActions.bind(liveLeaderboardStore))
export default liveLeaderboardStore
