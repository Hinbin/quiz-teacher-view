import firebase from 'firebase'
import globals from '../globals'

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
                globals.addUser('ABCDEF', 'Test Person')
                globals.addUser('GHIJKL', 'Test Person 2').then(done())
            })
            .perform((done) => {
                globals.setScore('ABCDEF', 5).then(done())
            })
            .init()
            .waitForElementVisible('#reset-button', 20000)
        leaderboard.reset()
    },
    'See if score changes by one': (browser) => {
        browser
            .perform((done) => {
                globals.addPoint('ABCDEF').then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .expect.element('#ABCDEF-score').text.to.equal('1')
        browser.expect.element('#ABCDEF-name').text.to.equal('Test Person')
        browser.expect.element('#ABCDEF-pos').text.to.equal('1')
        browser.expect.element('#ABCDEF').to.have.attribute('class').which.contains('lastChanged').before(500)
        browser.expect.element('#ABCDEF').to.not.have.attribute('class').which.contains('lastChanged').before(1200)
    },
    'See if two people can be in the lb': (browser) => {
        browser
            .perform((done) => {
                globals.setScore('GHIJKL', 2).then(done())
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
                globals.removeLBEntry('GHIJKL').then((done()))
            })
            .waitForElementNotPresent('#GHIJKL')
    },
    'Handle no user data': (browser) => {
        browser
            .perform((done) => {
                globals.setScore('MNOPQR', 5).then((done()))
            })
            .waitForElementVisible('#MNOPQR')
        browser.expect.element('#MNOPQR-name').text.to.equal('Anonymous')
        browser.end()
    }

}
