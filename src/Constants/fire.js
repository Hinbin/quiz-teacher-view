import firebase from 'firebase'

let config

// Switched between the production and test databases depending on if jest is being run.
if (process.env.NODE_ENV === 'production') {
    config = {
        apiKey: 'AIzaSyDYrOCyl54o1YnHEA30STeXptXbY7oTrIU',
        authDomain: 'ogatquestionbank.firebaseapp.com',
        databaseURL: 'https://ogatquestionbank.firebaseio.com',
        projectId: 'ogatquestionbank',
        storageBucket: 'ogatquestionbank.appspot.com',
        messagingSenderId: '754635765238'
    }
} else {
    config = {
        apiKey: 'AIzaSyD1FyJC4PMHfINU6ZqH6tUTgKmGiZLalug',
        authDomain: 'ogatquestionbanktest.firebaseapp.com',
        databaseURL: 'https://ogatquestionbanktest.firebaseio.com',
        projectId: 'ogatquestionbanktest',
        storageBucket: '',
        messagingSenderId: '904467971812'
    }
}

if (!firebase.apps.length) {
    firebase.initializeApp(config)
}

export default firebase
