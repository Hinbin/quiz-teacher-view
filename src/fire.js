import firebase from 'firebase'

var config = {
    apiKey: 'AIzaSyDYrOCyl54o1YnHEA30STeXptXbY7oTrIU',
    authDomain: 'ogatquestionbank.firebaseapp.com',
    databaseURL: 'https://ogatquestionbank.firebaseio.com',
    projectId: 'ogatquestionbank',
    storageBucket: 'ogatquestionbank.appspot.com',
    messagingSenderId: '754635765238'
}
var fire = firebase.initializeApp(config)
export default fire
