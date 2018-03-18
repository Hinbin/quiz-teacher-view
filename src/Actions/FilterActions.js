import firebase from 'firebase'
import dispatcher from '../dispatcher'

// Load all the filters that can be used by the leaderboard.  Topic filters will be
// subject specific.
export function loadFilters (leaderboardSnapshot, subjectFilter) {
    const db = firebase.database()
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
            type: 'LOAD_FILTERS',
            value: leaderboardFilters
        })
    })
}
