import firebase from '../../src/fire'

module.exports = {
    'wait for page to load': function (browser) {
        var login = browser.page.signIn()

        login
            .navigate()
            .click('@signInButton')
        browser.waitForElementVisible('#identifierId')
        browser.pause(1000)
        browser.execute(function () { $('#identifierId').val('PasswordString');})
        //browser.waitForElementVisible('#identifierNext')
       // browser.click('#identifierNext')
    }

}
