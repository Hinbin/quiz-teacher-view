import firebase from 'firebase'
import globals from '../globals'
import filterDB from '../databases/filterDatabase.json'

module.exports = {
    'wait for page to load': function (browser) {
        browser
            .perform((done) => {
                firebase.database().ref('/').set(null).then(done())
            })
            .perform((done) => {
                globals.loadDatabase(filterDB).then(done())
            })
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
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
        browser
            .click('#Schools-dropdown')
            .waitForElementVisible('#Schools-Outwood-Grange')
            .click('#Schools-Outwood-Grange')
            .expect.element('#ABCDEF').to.not.be.present
        browser.expect.element('#GHIJKL').to.be.present
        browser
            .click('#Schools-dropdown')
            .waitForElementVisible('#Schools-Test-School')
            .click('#Schools-Test-School')
            .expect.element('#GHIJKL').to.not.be.present
        browser.expect.element('#ABCDEF').to.be.present
        browser.end()
    },
    'Check points are added after filter select': function (browser) {
        browser
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-Computer-Science')
            .click('#Subjects-Computer-Science')
            .expect.element('#GHIJKL').to.not.be.present
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL']).then(done())
            })
            .expect.element('#ABCDEF').to.be.present
        browser.expect.element('#GHIJKL').to.be.present
        browser.end()
    },
    'Check points are are not added for different subjects': function (browser) {
        browser
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
            .waitForElementVisible('#Subjects-dropdown', 20000)
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-History')
            .click('#Subjects-History')
            .perform((done) => {
                globals.addPoint('ABCDEF').then(done())
            })
            .expect.element('#ABCDEF').to.not.be.present
        browser
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/History/Overall/').then(done())
            })
            .expect.element('#GHIJKL').to.be.present
        browser.end()
    },
    'Check that topic is overall by default on new subject': function (browser) {
        browser
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
            .waitForElementVisible('#Subjects-dropdown', 20000)
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-Computer-Science')
            .click('#Subjects-Computer-Science')
            .expect.element('#Topics-dropdown').text.to.equal('Overall')
        browser
            .click('#Topics-dropdown')
            .waitForElementVisible('#Topics-System-Architecture')
            .click('#Topics-System-Architecture')
            .expect.element('#Topics-dropdown').text.to.equal('System Architecture')
        browser
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-Computer-Science')
            .click('#Subjects-Computer-Science')
            .expect.element('#Topics-dropdown').text.to.equal('Overall')
        browser.end()
    },
    'Check filtering by topic': function (browser) {
        browser
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
            .waitForElementVisible('#Subjects-dropdown', 20000)
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-Computer-Science')
            .click('#Subjects-Computer-Science')
            .click('#Topics-dropdown')
            .waitForElementVisible('#Topics-System-Architecture')
            .click('#Topics-System-Architecture')
            .perform((done) => {
                globals.addPoint('ABCDEF', 'weeklyLeaderboard/Computer Science/System Architecture/').then(done())
            })
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/Computer Science/Overall/').then(done())
            })
            .expect.element('#ABCDEF').to.be.present
        browser.expect.element('#GHIJKL').to.not.be.present
        browser.end()
    },
    'Check filtering by subject': function (browser) {
        browser
            .init()
            .waitForElementVisible('#reset-button', 20000)
            .click('#reset-button')
            .pause(1000)
            .init()
            .waitForElementVisible('#Subjects-dropdown', 20000)
            .click('#Subjects-dropdown')
            .waitForElementVisible('#Subjects-Computer-Science')
            .click('#Subjects-Computer-Science')
            .perform((done) => {
                globals.addPoint('ABCDEF', 'weeklyLeaderboard/History/Overall/').then(done())
            })
            .perform((done) => {
                globals.addPoint('GHIJKL', 'weeklyLeaderboard/Computer Science/Overall/').then(done())
            })
            .expect.element('#GHIJKL').to.be.present
        browser.expect.element('#ABCDEF ').to.not.be.present
        browser.end()
    }
}
