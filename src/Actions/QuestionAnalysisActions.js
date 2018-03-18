import dispatcher from '../dispatcher'
import firebase from '../fire'

import {loadFilters} from './FilterActions'

const DAMPING_VALUE = 4

// Live analysis?

export function loadQuestionAnalysis () {
    firebase.database().ref('/weeklyLeaderboard/').once('value').then((leaderboardSnapshot) => {
        return leaderboardSnapshot
    }).then((leaderboardSnapshot) => {
        loadFilters(leaderboardSnapshot, 'Computer Science')
    }).then(() => {
        dispatcher.dispatch({type: 'LOAD_LEADERBOARD_FINISHED'})
    })
}

export function getAnalysis (schoolName, subject) {
    let db = firebase.database()

    let questionHistory = {}

    // Get a list of the users that belong to the school chosen
    db.ref('/users').orderByChild('school').equalTo(schoolName).once('value').then((snapshot) => {
        return snapshot
    }).then((userSnapshot) => {
        // For each user in that school...
        userSnapshot.forEach((user) => {
            // Get the answer history for the user for the subject selected
            let key = 'answerHistory/' + user.key + '/' + subject + '/GCSE/'
            db.ref(key).once('value').then((subjectSnapshot) => {
                // Then go through each topic and submit each question for analysis
                subjectSnapshot.forEach((topicSnapshot) => {
                    topicSnapshot.forEach((questionSnapshot) => {
                        doQuestionAnalysis(questionSnapshot, questionHistory)
                    })
                })
            })
        })

        dispatcher.dispatch({
            type: 'QUESTION_ANALYSIS_SCHOOL_SELECTED',
            value: {
                schoolName: schoolName,
                questionHistory: questionHistory
            }
        })
    })
}

function doQuestionAnalysis (question, questionHistory) {
    let questionObj = question.val()
    questionObj.topic = question.ref.parent.key
    if (questionHistory[question.key] !== undefined) {
        let questionData = questionHistory[question.key]
        let {timesAttempted, timesIncorrect} = questionObj

        // If the times attempted is greater than the damping value,
        // scale the times attempted to the correct % for the damping value
        if (questionObj.timesAttempted > DAMPING_VALUE) {
            let percentIncorrect = timesIncorrect / timesAttempted
            timesIncorrect = DAMPING_VALUE * percentIncorrect
            timesAttempted = DAMPING_VALUE
        }
        questionData.timesAttempted += timesAttempted
        questionData.timesIncorrect += timesIncorrect
        questionHistory[question.key] = questionData
    } else {
        questionHistory[question.key] = questionObj
    }
}
