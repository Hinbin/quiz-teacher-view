module.exports = {

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
        }
    }
}
