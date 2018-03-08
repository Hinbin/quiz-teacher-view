import firebase from 'firebase'
import globals from '../globals'

module.exports = {
    'wait for page to load': function (browser) {
        browser
            .perform((done) => {
                firebase.database().ref('/').set(null).then(done())
            })
            .perform((done) => {
                globals.setupDatabase().then(done())
            })
            .init()
            .waitForElementVisible('h1', 20000)
            .pause(1000)
    },
    'Check all users appear': (browser) => {
        browser
            .perform((done) => {
                globals.addPoints(['ABCDEF', 'GHIJKL', 'MNOPQR', 'STUVWX'])
                    .then(done())
            })
            .waitForElementVisible('#ABCDEF')
            .waitForElementVisible('#GHIJKL')
            .waitForElementVisible('#MNOPQR')
            .waitForElementVisible('#STUVWX')
            .expect.element('#ABCDEF-score').text.to.equal('1')
    },
    'Check that top score is in position one': (browser) => {
        browser
            .perform((done) => {
                globals.addPoint('STUVWX').then(done())
            })
            .expect.element('#STUVWX-pos').text.to.equal('1').before(1000)
        browser.expect.element('#STUVWX-score').text.to.equal('2')
        browser.useXpath()
            .expect.element('//tbody/tr[1]').has.attribute('id').equal('STUVWX')
        browser.useCss()
    },
    'Check all other positions are correct': (browser) => {
        browser
            .perform((done) => {
                globals.addPoints(['STUVWX', 'GHIJKL', 'MNOPQR']).then(done())
            })
            .perform((done) => {
                globals.addPoints(['STUVWX', 'MNOPQR']).then(done())
            })
        browser.expect.element('#ABCDEF-pos').text.to.equal('4').before(1000)
        browser.expect.element('#GHIJKL-pos').text.to.equal('3')
        browser.expect.element('#MNOPQR-pos').text.to.equal('2')
        browser.expect.element('#STUVWX-pos').text.to.equal('1')
        browser.useCss()
    },
    'Check teachers are not shown': (browser) => {
        browser
            .perform((done) => {
                globals.addUser('TEACH1', 'Mr. Teacher', true).then(done())
            })
            .perform((done) => {
                globals.setScore('TEACH1', 5).then(done())
            })
        browser.pause(1000)
        browser.expect.element('#TEACH1').to.not.be.present
        browser.end()
    }
}
