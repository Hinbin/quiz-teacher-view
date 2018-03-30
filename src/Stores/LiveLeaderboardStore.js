import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.leaderboardPath = ['Computer Science', 'Overall']
        this.initialLeaderboard = {}
        this.currentLeaderboard = {}
        this.lastChanged = ''
    }

    getCurrentLeaderboard () {
        return this.currentLeaderboard
    }

    loadLeaderboard (newLeaderboard) {
        this.initialLeaderboard = newLeaderboard
        this.currentLeaderboard = {}
        this.emit('change')
    }

    leaderboardFilterChange (value) {
        if (value.name !== 'Schools') this.currentLeaderboard = {}
        this.emit('change')
    }

    leaderboardChange (leaderboardChange) {
        const {uid} = leaderboardChange
        // If this is the users first time in the weekly leaderboard,
        // set their score to 0
        if (this.initialLeaderboard[uid] === undefined) {
            this.initialLeaderboard[uid] = 0
        }

        // Don't show this person if they're flagged as a teacher
        if (leaderboardChange.isTeacher !== undefined && leaderboardChange.isTeacher === true) {
            return
        }

        const liveScore = this.calculateLiveScore(leaderboardChange)

        if (liveScore === 0) return // Don't do anything if this person hasn't increased their score

        if (leaderboardChange.name === null) {
            leaderboardChange.name = 'Anonymous'
            leaderboardChange.school = 'Anonymous'
        }

        // Get all the user details from the change object, but replace the score with the "live score"
        this.currentLeaderboard[uid] = {...leaderboardChange, score: liveScore}

        this.lastChanged = uid
        this.currentLeaderboard[uid].lastChanged = true

        this.emit('change')

        // Save the current leaderboard into local storage for retrival later
        localStorage.setItem('leaderboard', JSON.stringify(this.initialLeaderboard))

        // After a second, remove the lastChanged flag.  This allows users who score twice in a
        // row to flash twice.
        setTimeout(() => {
            if (this.currentLeaderboard[this.lastChanged] !== undefined) {
                this.currentLeaderboard[this.lastChanged].lastChanged = false
                this.emit('change')
            }
        },
        1000)
    }

    calculateLiveScore (leaderboardChange) {
        const {uid, score} = leaderboardChange
        const path = this.leaderboardPath
        // Calculate the difference between the score when the leaderboard was loaded, and the score given
        // in the change
        const initialScore = this.initialLeaderboard[path[0]][path[1]][uid]
        if (initialScore === undefined) {
            return score
        } else {
            const liveScore = score - initialScore
            return liveScore
        }
    }

    leaderboardRemove (uid) {
        delete this.currentLeaderboard[uid]
        this.emit('change')
    }

    handleActions (action) {
        console.log(action)
        switch (action.type) {
        case 'LOAD_LEADERBOARD' : {
            break
        }
        case 'LOAD_LEADERBOARD_INITIAL_SCORES': {
            this.loadLeaderboard(action.value)
            break
        }
        case 'LEADERBOARD_CHANGE':
        {
            this.leaderboardChange(action.value)
            break
        }
        case 'LEADERBOARD_REMOVE':
        {
            this.leaderboardRemove(action.value)
            break
        }
        case 'FILTER_CHANGE':
        {
            this.leaderboardFilterChange(action.value)
            break
        }

        default:
        }
    }
}

const liveLeaderboardStore = new LiveLeaderboardStore()
dispatcher.register(liveLeaderboardStore.handleActions.bind(liveLeaderboardStore))
export default liveLeaderboardStore
