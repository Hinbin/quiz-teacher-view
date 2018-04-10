import { EventEmitter } from 'events'
import firebase from '../fire'

import dispatcher from '../dispatcher'

class LiveLeaderboardStore extends EventEmitter {
    constructor () {
        super()
        this.initialLeaderboard = {}
        this.currentLeaderboard = {}
        this.lastChanged = ''
        this.path = ['Computer Science', 'Overall']
        this.oldPath = []
    }

    listenToLeaderboard () {
        // If we have an old leaderboard we have been listening to, stop listening to it
        if (this.oldPath !== undefined) {
            let oldPath = this.oldPath.join('/')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_changed')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_added')
            firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_removed')
        }

        let path = this.path.join('/')

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

    loadInitialScores (leaderboardSnapshot) {
        let initialLeaderboard = JSON.parse(localStorage.getItem('leaderboard'))

        if (initialLeaderboard === null) {
            // Get the score, name, work out the position and then add the value to the scoreArray.
            return this.resetLeaderboard()

            // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        } else {
            return Promise.resolve(initialLeaderboard)
        }
    }

    loadLeaderboard (paths) {
        this.path = paths.path
        this.oldPath = paths.oldPath

        return this.loadInitialScores().then((initialLeaderboard) => {
            this.initialLeaderboard = initialLeaderboard
            this.listenToLeaderboard(this.path, this.oldPath)

            this.currentLeaderboard = {}
            this.emit('change')
        })
    }

    getCurrentLeaderboard () {
        return this.currentLeaderboard
    }

    getPath () {
        return this.path
    }

    leaderboardFilterChange (value) {
        const oldPath = this.path
        let newPath
        if (value.name === 'Subjects') {
            newPath = [value.option, oldPath[1]]
        } else if (value.name === 'Topics') {
            newPath = [oldPath[0], value.option]
        }

        let paths = {
            oldPath: oldPath,
            path: newPath
        }

        if (value.name !== 'Schools') this.loadLeaderboard(paths)

        this.emit('change')
    }

    getUserDetails (snapshot) {
        let uid = snapshot.key
        return firebase.database().ref('/users').orderByKey().equalTo(uid).once('value').then((personSnapshot) => {
            var score = {
                uid: uid,
                score: snapshot.val(),
                school: personSnapshot.child(uid + '/school').val(),
                name: personSnapshot.child(uid + '/displayName').val(),
                winner: personSnapshot.child(uid + '/winner').val(),
                isTeacher: personSnapshot.child(uid + '/isTeacher').val(),
                path: snapshot.ref.path.pieces_
            }
            return score
        })
    }

    leaderboardChange (snapshot) {
        const uid = snapshot.key
        // If this is the users first time in the weekly leaderboard,
        // set their score to 0
        if (this.initialLeaderboard[uid] === undefined) {
            this.initialLeaderboard[uid] = 0
        }

        this.getUserDetails(snapshot)
            .then((score) => {
                // Don't show this person if they're flagged as a teacher
                if (score.isTeacher !== undefined && score.isTeacher === true) {
                    return
                }

                const liveScore = this.calculateLiveScore(score)

                if (liveScore === 0) return // Don't do anything if this person hasn't increased their score

                if (score.name === null) {
                    score.name = 'Anonymous'
                    score.school = 'Anonymous'
                }

                // Get all the user details from the change object, but replace the score with the "live score"
                this.currentLeaderboard[uid] = {...score, score: liveScore}

                this.lastChanged = uid
                this.currentLeaderboard[uid].lastChanged = true

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
            })
    }

    calculateLiveScore (leaderboardChange) {
        const {uid, score} = leaderboardChange
        const path = this.path
        // Calculate the difference between the score when the leaderboard was loaded, and the score given
        // in the change
        try {
            const initialScore = this.initialLeaderboard[path[0]][path[1]][uid]
            if (initialScore === undefined) {
                return score
            } else {
                const liveScore = score - initialScore
                return liveScore
            }
        } catch (TypeError) {
            // Catch if the path doesn't exist and return 0
            console.error('Cannot find entry for', path[0], path[1], uid)
            return 0
        }
    }

    leaderboardRemove (uid) {
        delete this.currentLeaderboard[uid]
        this.emit('change')
    }

    resetLeaderboard () {
        return firebase.database().ref('/weeklyLeaderboard/').once('value').then((leaderboardSnapshot) => {
            return leaderboardSnapshot
        }).then((leaderboardSnapshot) => {
            const lbData = leaderboardSnapshot.val()
            this.initialLeaderboard = lbData
            // Save the current leaderboard into local storage for retrival later
            localStorage.setItem('leaderboard', JSON.stringify(this.initialLeaderboard))
            this.emit('change')
        })
    }

    handleActions (action) {
        console.log(action)
        switch (action.type) {
        case 'LEADERBOARD_LOAD' : {
            this.loadLeaderboard(action.value)
            break
        }
        case 'LEADERBOARD_RESET' : {
            this.resetLeaderboard(action.value)
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
