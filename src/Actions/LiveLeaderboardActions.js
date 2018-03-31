import dispatcher from '../dispatcher'
import firebase from '../fire'

export function loadLeaderboard (path, oldPath) {
    dispatcher.dispatch({
        type: 'LOAD_LEADERBOARD',
        value: path})
}

export function resetLeaderboard (path, oldpath) {
    localStorage.removeItem('leaderboard')
    dispatcher.dispatch({
        type: 'RESET_LEADERBOARD'
    })
    loadLeaderboard(path, oldpath)
}

function loadInitialScores (leaderboardSnapshot) {
    let initialLeaderboard = JSON.parse(localStorage.getItem('leaderboard'))
    let leaderboardObject = {}

    if (initialLeaderboard === null) {
        // Get the score, name, work out the position and then add the value to the scoreArray.
        leaderboardObject = leaderboardSnapshot.val()

        // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_INITIAL_SCORES',
            value: leaderboardObject
        })
    } else {
        leaderboardObject = initialLeaderboard
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_INITIAL_SCORES',
            value: leaderboardObject
        })
    }
}

function processLeaderboardChange (snapshot) {
    firebase.database().ref('/users').orderByKey().equalTo(snapshot.key).once('value').then((personSnapshot) => {
        var uid = snapshot.key
        var score = {
            uid: uid,
            score: snapshot.val(),
            school: personSnapshot.child(uid + '/school').val(),
            name: personSnapshot.child(uid + '/displayName').val(),
            winner: personSnapshot.child(uid + '/winner').val(),
            isTeacher: personSnapshot.child(uid + '/isTeacher').val(),
            path: snapshot.ref.path.pieces_
        }
        dispatcher.dispatch(
            {
                type: 'LEADERBOARD_CHANGE',
                value: score
            })
    })
}

function removeEntry (snapshot) {
    dispatcher.dispatch({
        type: 'LEADERBOARD_REMOVE',
        value: snapshot.key
    })
}

function listenToLeaderboard (path, oldPath) {
    // If we have an old leaderboard we have been listening to, stop listening to it
    if (oldPath !== undefined) {
        oldPath = oldPath.join('/')
        firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_changed')
        firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_added')
        firebase.database().ref('weeklyLeaderboard/' + oldPath).off('child_removed')
    }

    path = path.join('/')

    // Attach listeners to the leaderboard we are interested in
    firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_changed', snapshot => {
        processLeaderboardChange(snapshot)
    })

    firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_added', snapshot => {
        processLeaderboardChange(snapshot)
    })

    firebase.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_removed', snapshot => {
        removeEntry(snapshot)
    })
}
