var signInCommands = {
    simpleLogin: function (username, password) {
        return this.waitForElementPresent('@signInButton')
            .click('@signInButton')
            .waitForElementVisible('@username')
            .setValue('@username', username)
            .click('@next')
            .waitForElementVisible('@password')
            .setValue('@password', password)
            .click('@submit')
            .waitForElementVisible('@signOutButton', 10000)
    }
}

module.exports = {
    commands: [signInCommands],

    url: function () {
        return this.api.launchUrl + '/signin'
    },

    elements: {
        username: {
            selector: 'input[type=email]'
        },
        signInButton: {
            selector: '#sign-in-button'
        },
        password: {
            selector: 'input[type=password]'
        },
        next: {
            selector: '#identifierNext'
        },
        submit: {
            selector: '#passwordNext'
        },
        signOutButton: {
            selector: '#sign-out-button'

        }
    }
}
