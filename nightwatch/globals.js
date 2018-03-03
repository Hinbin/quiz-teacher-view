import firebase from 'firebase'

module.exports = {

    waitForConditionTimeout: 5000,
    after: function (done) {
        firebase.app().delete()
    }
}
