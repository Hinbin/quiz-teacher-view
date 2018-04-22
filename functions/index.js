const functions = require('firebase-functions')
const admin = require('firebase-admin')
const secureCompare = require('secure-compare')

admin.initializeApp()

exports.enableDoubleXP = functions.https.onRequest((req, res) => {
    const key = req.query.key

    if (!secureCompare(key, functions.config().cron.key)) {
        console.log('The key provided in the request does not match the key set in the environment. Check that', key,
            'matches the cron.key attribute in `firebase env:get`')
        res.status(403).send('Security key does not match. Make sure your "key" URL query parameter matches the ' +
        'cron.key environment variable.')
        return null
    }

    return successful()
})

function successful () {
    console.log('this worked')
}
