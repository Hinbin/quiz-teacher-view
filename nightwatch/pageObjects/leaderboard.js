module.exports = {

    url: function () {
        return this.api.launchUrl + '/leaderboard'
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
