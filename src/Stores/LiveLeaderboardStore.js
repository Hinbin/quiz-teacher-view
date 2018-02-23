import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.leaderboard = [
            {
                uid: 'KASJDHJASKD',
                name: 'testperson',
                score: 32
            },
            {
                uid: 'ASKDJHASKD',
                name: 'another person',
                score: 54
            }
        ]
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
