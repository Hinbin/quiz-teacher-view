import firebase from 'firebase'
import fire from '../../src/fire'

module.exports = {
    'See if page loads': function (browser) {
        browser
            .perform((done) => {
                firebase.database().ref('/').set(null).then(done())
            })
            .perform((done) => {
                addUser('ABCDEF', 'Test Person')
                addUser('GHIJKL', 'Test Person 2').then(done())
            })
            .perform((done) => {
                setScore('ABCDEF', 5).then(done())
            })
            .init()
            .waitForElementVisible('h1', 20000)
            .pause(1000)
    },
    'See if score changes by one': (browser) => {
        browser
            .perform((done) => {
                addPoint('ABCDEF').then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .expect.element('#ABCDEF-score').text.to.equal('1')
        browser.expect.element('#ABCDEF-name').text.to.equal('Test Person')
        browser.expect.element('#ABCDEF-pos').text.to.equal('1')
        browser.expect.element('#ABCDEF').to.have.attribute('class').which.contains('lastChanged')
        browser.pause(1000)
        browser.expect.element('#ABCDEF').to.not.have.attribute('class').which.contains('lastChanged')
    },
    'See if two people can be in the lb': (browser) => {
        browser
            .perform((done) => {
                setScore('GHIJKL', 2).then(done())
            })
            .waitForElementVisible('#GHIJKL')
            .expect.element('#GHIJKL-score').text.to.equal('2')
        browser.expect.element('#GHIJKL-name').text.to.equal('Test Person 2')
        browser.expect.element('#GHIJKL-pos').text.to.equal('1')
        browser.expect.element('#ABCDEF-pos').text.to.equal('2')
    },
    'See if people are removed from the lb': (browser) => {
        browser
            .perform((done) => {
                removeLBEntry('GHIJKL').then((done()))
            })
            .waitForElementNotPresent('#GHIJKL')
    },
    'handle no user data': (browser) => {
        browser
            .perform((done) => {
                setScore('MNOPQR', 5).then((done()))
            })
            .waitForElementVisible('#MNOPQR')
        browser.expect.element('#MNOPQR-name').text.to.equal('Anonymous')
        browser.end()
    }

}

function removeLBEntry (uid) {
    return fire.database().ref('/weeklyLeaderboard/Computer Science/Overall/' + uid).set(null)
}

function addUser (uid, displayName) {
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
