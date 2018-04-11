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
            
        browser.pause(1000)

        browser.init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')

    },
    'Check scores are set after reset': function (browser) {
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .expect.element('#ABCDEF-score').text.to.equal('1')
        browser.expect.element('#GHIJKL-score').text.to.equal('1')
        browser.execute(() => {
            return localStorage.getItem('leaderboard')
        }, [], (result) => {
            globals.storage = result.value
        })
    },
    'Check scores have persisted through close': function (browser) {
        browser.refresh()
        browser.expect.element('#ABCDEF').to.be.present
    },
    'Check scores persist for subject not selected.': function (browser) {
        browser
            .refresh()
            .waitForElementVisible('#ABCDEF')
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-History')
            .click('#Subjects-History')
            .expect.element('#ABCDEF').to.not.be.present
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
        browser.click('#Subjects-dropdown')
        browser.waitForElementVisible('#Subjects-Computer-Science')
        browser.click('#Subjects-Computer-Science')
        browser.expect.element('#GHIJKL').to.be.present
        browser.end()
    }
}
