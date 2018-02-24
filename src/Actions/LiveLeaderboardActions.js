import dispatcher from '../dispatcher'
import fire from '../fire'

export function loadLeaderboard () {
    dispatcher.dispatch({type: 'LOAD_LEADERBOARD'})
    fire.database().ref('weeklyLeaderboard/Computer Science/Overall').orderByValue().once('value', snapshot => {
        getLeaderboardUserDetails(snapshot)
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

// Firebase sorts from lowest to highest by default.  This means we need to reverse through
// the array.

function getLeaderboardUserDetails (snapshot) {
    var leaderboardObject = {}
    var userPromises = [] // Stores all the promises we are going to call from the Firebase database.

    // For every item in the FB snapshot given...
    snapshot.forEach(function (scoreSnapshot) {
        var uid = scoreSnapshot.key
        // Get the score, name, work out the position and then add the value to the scoreArray.
        var promise

        promise = fire.database().ref('users/' + uid).once('value', function (snapshot) {
            // If we find out that this user is a teacher, do not include them.
            if (snapshot.child('isTeacher').val() !== true && snapshot.child('school').val() !== null) {
                var score = {
                    score: scoreSnapshot.val(),
                    school: snapshot.child('school').val(),
                    name: snapshot.child('displayName').val(),
                    winner: snapshot.child('winner').val()
                }

                /*
                var rewardKey = self.key
                // Alter the key to refer to weeklyLeaderboard instead of leaderboard
                if (self.leaderboardKey === 'leaderboard') {
                    rewardKey = 'weeklyLeaderboard' + self.key.slice(11)
                }

                rewardKey = rewardKey + '/rewardLevel'

                // Find if this user has a reward level for this leaderboard.
                score.rewardLevel = snapshot.child(rewardKey).val()
                */

                leaderboardObject[scoreSnapshot.key] = score
            }
        })

        userPromises.push(promise)
    })

    // This code is only run once we have the name and school of everyone from our leaderboard
    Promise.all(userPromises).then(function (results) {
        // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_COMPLETE',
            value: leaderboardObject}
        )
    })
}
