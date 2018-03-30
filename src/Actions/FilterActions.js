import firebase from 'firebase'
import dispatcher from '../dispatcher'

// Load all the filters that can be used by the leaderboard.  Topic filters will be
// subject specific.
export function loadFilters () {
    const db = firebase.database()
    db.ref('schools/').once('value').then((schoolSnapshot) => {
        return schoolSnapshot
    }).then((schoolSnapshot) => {
        // Look through all the schools and then add them to the array.  Only add unique
        // schools so we don't get dupilcates
        const schools = schoolSnapshot.val()
        let schoolArray = []

        for (let i in schools) {
            let school = schools[i]
            if (!schoolArray.includes(school)) schoolArray.push(school)
        }

        // Add all the current filters together
        const leaderboardFilters = [
            {
                name: 'Schools',
                options: schoolArray
            }
        ]
        dispatcher.dispatch({
            type: 'LOAD_SCHOOL_FILTER',
            value: leaderboardFilters
        })
    })
}

export function setFilter (name, option) {
    dispatcher.dispatch({
        type: 'FILTER_CHANGE',
        value: {
            name: name,
            option: option }
    })
}
