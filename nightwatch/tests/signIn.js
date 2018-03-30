import * as loginDetails from '../loginDetails'

module.exports = {
    'can login with valid user': function (browser) {
        var login = browser.page.signIn()

        login
            .navigate()
            .simpleLogin(loginDetails.validUsername, loginDetails.validPassword)
            .click('@signOutButton')
            .waitForElementNotPresent('@signOutButton')
        browser.end()
    },
    'invalid user cannot login': function (browser) {
        var login = browser.page.signIn()

        login
            .navigate()
            .simpleLogin(loginDetails.invalidUsername, loginDetails.invalidPassword)
            .waitForElementNotPresent('@signOutButton')
        browser.end()
    }
}
