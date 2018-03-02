import dispatcher from '../dispatcher'
import fire from '../fire'

export function loadLeaderboard () {
    dispatcher.dispatch({type: 'LOAD_LEADERBOARD'})
    fire.database().ref('weeklyLeaderboard/Computer Science/Overall').orderByValue().once('value', snapshot => {
        let leaderboardObject = {}

        snapshot.forEach(function (scoreSnapshot) {
            var uid = scoreSnapshot.key
            // Get the score, name, work out the position and then add the value to the scoreArray.
            leaderboardObject[uid] = scoreSnapshot.val()
        })
        // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_COMPLETE',
            value: leaderboardObject}
        )
    })
}

export function listenToLeaderboard () {
    fire.database().ref('weeklyLeaderboard/Computer Science/Overall').orderByValue().on('child_changed', snapshot => {
        fire.database().ref('/users').orderByKey().equalTo(snapshot.key).once('value').then((personSnapshot) => {
            var uid = snapshot.key
            var score = {
                uid: uid,
                score: snapshot.val(),
                school: personSnapshot.child(uid + '/school').val(),
                name: personSnapshot.child(uid + '/displayName').val(),
                winner: personSnapshot.child(uid + '/winner').val()
            }
            dispatcher.dispatch(
                {
                    type: 'LEADERBOARD_CHANGE',
                    value: score
                })
        })
    })
}
