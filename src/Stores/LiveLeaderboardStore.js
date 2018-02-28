import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.initialLeaderboard = {}
        this.currentLeaderboard = {}
        this.leaderboard = []
        this.lastChanged = ''
    }

    loadLeaderboard (newLeaderboard) {
        this.initialLeaderboard = newLeaderboard
    }

    leaderboardChange (leaderboardChange) {
        const {uid, score} = leaderboardChange
        const liveScore = score - this.initialLeaderboard[uid].score
        this.currentLeaderboard[uid] = {score: liveScore, ...leaderboardChange}

        var sortable = []
        for (var key in this.currentLeaderboard) {
            if (this.currentLeaderboard.hasOwnProperty(key)) {
                if (uid === key) {
                    if (this.lastChanged.length > 0) {
                        this.currentLeaderboard[this.lastChanged].lastChanged = false
                    }
                    this.lastChanged = key
                    this.currentLeaderboard[key].lastChanged = true
                }
                sortable.push(this.currentLeaderboard[key])
            }
        }

        sortable.sort((a, b) => b.score - a.score)

        for (var i in sortable) {
            sortable[i].position = parseInt(i, 10) + 1
        }
        this.leaderboard = sortable

        this.emit('change')

        setTimeout(() => {
            this.currentLeaderboard[this.lastChanged].lastChanged = false
            this.emit('change')
        },
        1000)
    }

    getAll () {
        return (this.leaderboard)
    }

    handleActions (action) {
        switch (action.type) {
        case 'LOAD_LEADERBOARD_COMPLETE': {
            this.loadLeaderboard(action.value)
            break
        }
        case 'LEADERBOARD_CHANGE':
        {
            this.leaderboardChange(action.value)
            break
        }
        default:
        }
    }
}

const liveLeaderboardStore = new LiveLeaderboardStore()
dispatcher.register(liveLeaderboardStore.handleActions.bind(liveLeaderboardStore))
export default liveLeaderboardStore
