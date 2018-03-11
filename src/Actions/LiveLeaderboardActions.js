import dispatcher from '../dispatcher'
import fire from '../fire'

export function loadLeaderboard (path, oldPath) {
    let dbPath = path.join('/')
    dispatcher.dispatch({
        type: 'LOAD_LEADERBOARD',
        value: dbPath})

    fire.database().ref('/weeklyLeaderboard/').once('value').then((leaderboardSnapshot) => {
        return leaderboardSnapshot
    }).then((leaderboardSnapshot) => {
        loadInitialScores(leaderboardSnapshot)
        loadFilters(leaderboardSnapshot, path[0])
    }).then(() => {
        dispatcher.dispatch({type: 'LOAD_LEADERBOARD_FINISHED'})
    })

    listenToLeaderboard(dbPath, oldPath)
}

export function resetLeaderboard (path, oldpath) {
    localStorage.removeItem('leaderboard')
    dispatcher.dispatch({
        type: 'RESET_LEADERBOARD'
    })
    loadLeaderboard(path, oldpath)
}

export function setFilter (option, name) {
    dispatcher.dispatch({
        type: 'LEADERBOARD_FILTER_CHANGE',
        value: {
            option: option,
            name: name
        }})

    // If we've changed the subject, we need to reset the topic as well.
    if (name === 'Subjects') {
        dispatcher.dispatch({
            type: 'LEADERBOARD_FILTER_CHANGE',
            value: {
                option: 'Overall',
                name: 'Topics'
            }})
    }
}

// Load all the filters that can be used by the leaderboard.  Topic filters will be
// subject specific.
function loadFilters (leaderboardSnapshot, subjectFilter) {
    const db = fire.database()
    db.ref('schools/').once('value').then((schoolSnapshot) => {
        return schoolSnapshot
    }).then((schoolSnapshot) => {
        // Look through all the schools and then add them to the array.  Only add unique
        // schools so we don't get dupilcates
        const schools = schoolSnapshot.val()
        let schoolArray = ['All']
        let subjectArray = []
        let topicArray = []

        for (let i in schools) {
            let school = schools[i]
            if (!schoolArray.includes(school)) schoolArray.push(school)
        }

        // Loop through our top level subjects and get the subject names
        const subjects = leaderboardSnapshot.val()
        for (let subject in subjects) {
            if (!subjectArray.includes(subject)) subjectArray.push(subject)
        }

        const topics = subjects[subjectFilter]

        if (topics !== undefined) {
            for (let topic in topics) {
                if (!topicArray.includes(topic)) topicArray.push(topic)
            }
        }

        // Add all the current filters together
        const leaderboardFilters = [
            {
                name: 'Schools',
                options: schoolArray
            },
            {
                name: 'Subjects',
                options: subjectArray
            },
            {
                name: 'Topics',
                options: topicArray
            }
        ]
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_FILTERS',
            value: leaderboardFilters
        })
    })
}

function loadInitialScores (leaderboardSnapshot) {
    let initialLeaderboard = JSON.parse(localStorage.getItem('leaderboard'))
    let leaderboardObject = {}

    if (initialLeaderboard === null) {
        // Get the score, name, work out the position and then add the value to the scoreArray.
        leaderboardObject = leaderboardSnapshot.val()

        // Now we have all of the results from the DB, make sure we sort it.  Otherwise late results are places first.
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_COMPLETE',
            value: leaderboardObject
        })
    } else {
        leaderboardObject = initialLeaderboard
        dispatcher.dispatch({
            type: 'LOAD_LEADERBOARD_COMPLETE',
            value: leaderboardObject
        })
    }
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

function listenToLeaderboard (path, oldPath) {
    // If we have an old leaderboard we have been listening to, stop listening to it
    if (oldPath !== undefined) {
        oldPath = oldPath.join('/')
        fire.database().ref('weeklyLeaderboard/' + oldPath).off('child_changed')
        fire.database().ref('weeklyLeaderboard/' + oldPath).off('child_added')
        fire.database().ref('weeklyLeaderboard/' + oldPath).off('child_removed')
    }

    // Attach listeners to the leaderboard we are interested in
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
