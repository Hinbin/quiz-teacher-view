import firebase from 'firebase'
import fire from '../../src/fire'

module.exports = {
    'wait for page to load': function (browser) {
        browser
            .perform((done) => {
                firebase.database().ref('/').set(null).then(done())
            })
            .perform((done) => {
                setupDatabase().then(done())
            })
            .init()
            .waitForElementVisible('h1', 20000)
            .pause(1000)
    },
    'Check all users appear': (browser) => {
        browser
            .perform((done) => {
                addPoints(['ABCDEF', 'GHIJKL', 'MNOPQR', 'STUVWX'])
                    .then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .waitForElementVisible('#GHIJKL')
            .waitForElementVisible('#MNOPQR')
            .waitForElementVisible('#STUVWX')
            .expect.element('#ABCDEF-score').text.to.equal('1')
        browser.end()
    }
}

function setupDatabase () {
    return Promise.all([
        addUser('ABCDEF', 'Alice'),
        addUser('GHIJKL', 'Bob'),
        addUser('MNOPQR', 'Charlie'),
        addUser('STUVWX', 'Dave'),
        fire.database().ref('/weeklyLeaderboard/Computer Science/Overall/').set(
            {
                ABCDEF: 4,
                GHIJKL: 4,
                MNOPQR: 3,
                STUVWX: 2
            })
    ])
}

function removeLBEntry (uid) {
    return fire.database().ref('/weeklyLeaderboard/Computer Science/Overall/' + uid).set(null)
}

function addUser (uid, displayName, isTeacher) {
    if (isTeacher === undefined) isTeacher = false
    let db = firebase.database()
    return db.ref('users/' + uid).set({
        displayName: displayName,
        school: 'Test School',
        isTeacher: false
    })
}

function setScore (uid, score) {
    let db = firebase.database()
    return db.ref('weeklyLeaderboard/Computer Science/Overall/' + uid).set(score)
}

function addPoint (uid) {
    let db = firebase.database()
    return db.ref('weeklyLeaderboard/Computer Science/Overall/' + uid).transaction((score) => {
        score = score + 1
        return score
    })
}

function addPoints (uids) {
    let promiseArray = []
    for (let i in uids) {
        promiseArray.push(addPoint(uids[i]))
    }
    return Promise.all(promiseArray)
}
