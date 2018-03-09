import firebase from 'firebase'
import fire from '../src/fire'

module.exports = {

    waitForConditionTimeout: 5000,
    after: function (done) {
        firebase.app().delete()
    },

    setupDatabase: function () {
        return Promise.all([
            this.addUser('ABCDEF', 'Alice'),
            this.addUser('GHIJKL', 'Bob'),
            this.addUser('MNOPQR', 'Charlie'),
            this.addUser('STUVWX', 'Dave'),
            fire.database().ref('/weeklyLeaderboard/Computer Science/Overall/').set(
                {
                    ABCDEF: 10,
                    GHIJKL: 10,
                    MNOPQR: 10,
                    STUVWX: 10
                })
        ])
    },

    loadDatabase: function (database) {
        return fire.database().ref().set(database)
    },

    removeLBEntry: function (uid) {
        return fire.database().ref('/weeklyLeaderboard/Computer Science/Overall/' + uid).set(null)
    },

    addUser: function (uid, displayName, isTeacher) {
        if (isTeacher === undefined) isTeacher = false
        let db = firebase.database()
        return db.ref('users/' + uid).set({
            displayName: displayName,
            school: 'Test School',
            isTeacher: isTeacher
        })
    },

    setScore: function (uid, score) {
        let db = firebase.database()
        return db.ref('weeklyLeaderboard/Computer Science/Overall/' + uid).set(score)
    },

    addPoint: function (uid, location) {
        if (location === undefined) location = 'weeklyLeaderboard/Computer Science/Overall/'
        let db = firebase.database()
        return db.ref(location + uid).transaction((score) => {
            score = score + 1
            return score
        })
    },

    addPoints: function (uids) {
        let promiseArray = []
        for (let i in uids) {
            promiseArray.push(this.addPoint(uids[i]))
        }
        return Promise.all(promiseArray)
    }
}
