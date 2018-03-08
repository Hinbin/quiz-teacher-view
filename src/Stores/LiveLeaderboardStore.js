import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.leaderboardPath = ['Computer Science', 'Overall']
        this.initialLeaderboard = {}
        this.currentLeaderboard = {}
        this.leaderboard = []
        this.lastChanged = ''
        this.currentFilters = []
        this.filters = []
    }

    leaderboardFilterChange (value) {
        // Remove any existing filters with the same name from the array
        this.currentFilters = this.currentFilters.filter((filter) => {
            if (filter.name !== value.name) {
                return true
            } else return false
        })

        // Push this new filter onto the array
        this.currentFilters.push(value)

        if (value.name === 'Schools') {
            // Sort the leaderboard and redraw it
            this.sortLeaderboard()
            this.emit('change')
        } else if (value.name === 'Subjects') {
            this.leaderboardPath[0] = value.option
            this.leaderboardPath[1] = 'Overall'
        } else if (value.name === 'Topics') {
            this.leaderboardPath[1] = value.option
        }
    }

    getFilters () {
        return this.filters
    }

    getCurrentFilters () {
        return this.currentFilters
    }

    loadLeaderboard (newLeaderboard) {
        this.initialLeaderboard = newLeaderboard
        this.currentLeaderboard = {}
        this.sortLeaderboard()
        this.emit('change')
    }

    leaderboardChange (leaderboardChange) {
        const {uid, score} = leaderboardChange
        // If this is the users first time in the weekly leaderboard,
        // set their score to 0
        if (this.initialLeaderboard[uid] === undefined) {
            this.initialLeaderboard[uid] = 0
        }

        // Don't show this person if they're flagged as a teacher
        if (leaderboardChange.isTeacher !== undefined && leaderboardChange.isTeacher === true) {
            return
        }

        // Calculate the difference between the score when the leaderboard was loaded, and the score given
        // in the change
        const initialScore = this.initialLeaderboard[uid]
        const liveScore = score - initialScore

        if (liveScore === 0) return // Don't do anything if this person hasn't increased their score

        if (leaderboardChange.name === null) {
            leaderboardChange.name = 'Anonymous'
            leaderboardChange.school = 'Anonymous'
        }

        // Get all the user details from the change object, but replace the score with the "live score"
        this.currentLeaderboard[uid] = {...leaderboardChange, score: liveScore}

        if (this.lastChanged.length > 0 && this.currentLeaderboard[this.lastChanged] !== undefined) {
            this.currentLeaderboard[this.lastChanged].lastChanged = false
        }

        this.lastChanged = uid
        this.currentLeaderboard[uid].lastChanged = true

        this.sortLeaderboard(uid)

        this.emit('change')

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

    // Converts the leaderboard object into a sorted array, sorted by score.
    sortLeaderboard () {
        // Build the array to be sorted that will contain all the leaderboard information
        var sortable = []
        for (var key in this.currentLeaderboard) {
            if (this.currentLeaderboard.hasOwnProperty(key)) {
                if (this.checkFilters(this.currentLeaderboard[key])) {
                    sortable.push(this.currentLeaderboard[key])
                }
            }
        }

        sortable.sort((a, b) => b.score - a.score)

        for (var i in sortable) {
            sortable[i].position = parseInt(i, 10) + 1
        }
        this.leaderboard = sortable
    }

    getAll () {
        return (this.leaderboard)
    }

    checkFilters (entry) {
        let filters = this.currentFilters
        for (let i in filters) {
            let filter = filters[i]
            if (filter.name === 'School' && entry.school !== filter.option) return false
        }
        return true
    }

    leaderboardRemove (uid) {
        delete this.currentLeaderboard[uid]
        this.sortLeaderboard()
        this.emit('change')
    }

    loadLeaderboardFilters (value) {
        this.filters = value
        this.emit('change')
    }

    handleActions (action) {
        console.log(action)
        switch (action.type) {
        case 'LOAD_LEADERBOARD' : {
            break
        }
        case 'LOAD_LEADERBOARD_FILTERS' : {
            this.loadLeaderboardFilters(action.value)
            break
        }
        case 'LOAD_LEADERBOARD_COMPLETE': {
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
        case 'LEADERBOARD_FILTER_CHANGE':
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
