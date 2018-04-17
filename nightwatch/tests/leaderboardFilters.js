import firebase from 'firebase'
import globals from '../globals'
import filterDB from '../databases/filterDatabase.json'

import * as loginDetails from '../loginDetails'

module.exports = {
    'See if page loads': function (browser) {
        var login = browser.page.signIn()
        var leaderboard = browser.page.leaderboard()

        login
            .navigate()
            .simpleLogin(loginDetails.validUsername, loginDetails.validPassword)

        leaderboard.navigate()

        browser
            .perform((done) => {
                firebase.database().ref('/').set(null).then(done())
            })
            .perform((done) => {
                globals.loadDatabase(filterDB).then(done())
            })
            .waitForElementVisible('#reset-button', 20000)

        browser.pause(1000)
        leaderboard.reset()
    },
    'Check all users are added at start': function (browser) {
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .expect.element('#ABCDEF-score').text.to.equal('1')
        browser.expect.element('#GHIJKL-score').text.to.equal('1')
    },
    'Check filter by school': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.changeFilter('@schoolFilter', 'Outwood Grange')
        leaderboard.expect.element('#ABCDEF').to.not.be.present
        leaderboard.expect.element('#GHIJKL').to.be.present
        leaderboard.changeFilter('@schoolFilter', 'Test School')
        leaderboard.expect.element('#GHIJKL').to.not.be.present
        leaderboard.expect.element('#ABCDEF').to.be.present
    },
    'Check points are added after filter select': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.changeFilter('@schoolFilter', 'All')
        leaderboard.reset()

        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .waitForElementVisible('#ABCDEF')
        leaderboard.changeFilter('@subjectFilter', 'Computer Science')
            .expect.element('#GHIJKL').to.be.present
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .expect.element('#ABCDEF').to.be.present
        browser.expect.element('#GHIJKL').to.be.present
    },
    'Check points are are not added for different subjects': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.reset()
        leaderboard.changeFilter('@subjectFilter', 'History')
        browser
            .perform((done) => {
                globals.addPoint('ABCDEF').then(done())
            })
            .expect.element('#ABCDEF').to.not.be.present
        browser
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/History/Overall/').then(done())
            })
            .expect.element('#GHIJKL').to.be.present
    },
    'Check that topic is overall by default on new subject': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.reset()
        leaderboard.changeFilter('@subjectFilter', 'Computer Science')
            .expect.element('#Topics-dropdown').text.to.equal('Overall')
        leaderboard.changeFilter('@topicFilter', 'System Architecture')
            .expect.element('#Topics-dropdown').text.to.equal('System Architecture')
        leaderboard.changeFilter('@subjectFilter', 'Computer Science')
            .expect.element('#Topics-dropdown').text.to.equal('Overall')
    },
    'Check filtering by topic': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.reset()
        leaderboard.changeFilter('@subjectFilter', 'Computer Science')
        leaderboard.changeFilter('@topicFilter', 'System Architecture')
        browser
            .perform((done) => {
                globals.addPoint('ABCDEF', 'weeklyLeaderboard/Computer Science/System Architecture/').then(done())
            })
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/Computer Science/Overall/').then(done())
            })
            .expect.element('#ABCDEF').to.be.present
        browser.expect.element('#GHIJKL').to.not.be.present
    },
    'Check filtering by subject': function (browser) {
        let leaderboard = browser.page.leaderboard()
        leaderboard.reset()
        leaderboard.changeFilter('@subjectFilter', 'Computer Science')
        browser
            .perform((done) => {
                globals.addPoint('ABCDEF', 'weeklyLeaderboard/History/Overall/').then(done())
            })
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/Computer Science/Overall/').then(done())
            })
            .expect.element('#GHIJKL').to.be.present
        browser.expect.element('#ABCDEF').to.not.be.present
        browser.end()
    }
}
