import { EventEmitter } from 'events'
import firebase from '../fire'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.leaderboardPath = ['Computer Science', 'Overall']
        this.initialLeaderboard = {}
        this.currentLeaderboard = {}
        this.lastChanged = ''
        this.path = ['Computer Science', 'Overall']
        this.oldPath = []
    }

    listenToLeaderboard (path, oldPath) {
        // If we have an old leaderboard we have been listening to, stop listening to it
        if (oldPath !== undefined) {
            oldPath = oldPath.join('/')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_changed')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_added')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_removed')
        }

        path = path.join('/')

        // Attach listeners to the leaderboard we are interested in
        firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_changed', snapshot => {
            this.leaderboardChange(snapshot)
        })

        firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_added', snapshot => {
            this.leaderboardChange(snapshot)
        })

        firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_removed', snapshot => {
            this.removeEntry(snapshot)
        })
    }    

    loadLeaderboard () {
        firebase.database().ref('/weeklyLeaderboard/').once('value').then((leaderboardSnapshot) => {
            return leaderboardSnapshot
        }).then((leaderboardSnapshot) => {
            this.loadInitialScores(leaderboardSnapshot)
            dispatcher.dispatch({
                type: 'LOAD_WEEKLY_SNAPSHOT',
                value: leaderboardSnapshot.val()
            })
        }).then(() => {
            dispatcher.dispatch({type: 'LOAD_LEADERBOARD_FINISHED'})
        })

        this.listenToLeaderboard(path, oldPath)

        this.initialLeaderboard = newLeaderboard
        this.currentLeaderboard = {}
        this.emit('change')
    }

    getCurrentLeaderboard () {
        return this.currentLeaderboard
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
