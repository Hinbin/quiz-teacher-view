import dispatcher from '../dispatcher'
import fire from '../fire'

export function loadLeaderboard (path) {
    dispatcher.dispatch({
        type: 'LOAD_LEADERBOARD',
        value: path})

    Promise.all([
        loadInitialScores(path),
        loadFilters(path)
    ]).then(() => {
        dispatcher.dispatch({type: 'LOAD_LEADERBOARD_FINISHED'})
    })
}

function loadFilters () {
    return ('nout')
}

function loadInitialScores (path) {
    return fire.database().ref('weeklyLeaderboard' + path).orderByValue().once('value', snapshot => {
        let leaderboardObject = {}

        snapshot.forEach(function (scoreSnapshot) {
            var uid = scoreSnapshot.key
            // Get the score, name, work out the position and then add the value to the scoreArray.
            leaderboardObject[uid] = scoreSnapshot.val()
        })

        // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_COMPLETE',
            value: leaderboardObject
        })
    })
}

function processLeaderboardChange (snapshot) {
    fire.database().ref('/users').orderByKey().equalTo(snapshot.key).once('value').then((personSnapshot) => {
        var uid = snapshot.key
        var score = {
            uid: uid,
            score: snapshot.val(),
            school: personSnapshot.child(uid + '/school').val(),
            name: personSnapshot.child(uid + '/displayName').val(),
            winner: personSnapshot.child(uid + '/winner').val(),
            isTeacher: personSnapshot.child(uid + '/isTeacher').val()
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

export function listenToLeaderboard (path) {
    fire.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_changed', snapshot => {
        processLeaderboardChange(snapshot)
    })

    fire.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_added', snapshot => {
        processLeaderboardChange(snapshot)
    })

    fire.database().ref('weeklyLeaderboard/' + path).orderByValue().on('child_removed', snapshot => {
        removeEntry(snapshot)
    })
}

export function setFilter (option, name) {
    dispatcher.dispatch({
        type: 'LEADERBOARD_FILTER_CHANGE',
        value: {
            option: option,
            name: name
        }})
}
