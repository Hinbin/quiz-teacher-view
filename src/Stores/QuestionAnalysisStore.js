import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'
import firebase from '../Constants/fire'

class QuestionAnalysisStore extends EventEmitter {
    constructor () {
        super()
        this.questionAnalysis = {}
        this.DAMPING_VALUE = 4
        this.path = ['Computer Science', 'Overall']
        this.oldPath = []
    }

    getPath () {
        return this.path
    }

    handleSchoolAnalysis (schoolName, path) {
        let db = firebase.database()

        let questionHistory = {}

        // Get a list of the users that belong to the school chosen
        db.ref('/users').orderByChild('school').equalTo(schoolName).once('value').then((snapshot) => {
            return snapshot
        }).then((userSnapshot) => {
            // For each user in that school...
            userSnapshot.forEach((user) => {
                // Get the answer history for the user for the subject selected
                let key = 'answerHistory/' + user.key + '/' + path[0] + '/GCSE/'
                db.ref(key).once('value').then((subjectSnapshot) => {
                    // Then go through each topic and submit each question for analysis
                    subjectSnapshot.forEach((topicSnapshot) => {
                        topicSnapshot.forEach((questionSnapshot) => {
                            this.doQuestionAnalysis(questionSnapshot, questionHistory)
                        })
                    })
                })
            })

            console.log(this.questionAnalysis)
        })
    }

    doQuestionAnalysis (question, questionHistory) {
        let questionObj = question.val()
        questionObj.topic = question.ref.parent.key
        if (questionHistory[question.key] !== undefined) {
            let questionData = questionHistory[question.key]
            let {timesAttempted, timesIncorrect} = questionObj

            // If the times attempted is greater than the damping value,
            // scale the times attempted to the correct % for the damping value
            if (questionObj.timesAttempted > this.DAMPING_VALUE) {
                let percentIncorrect = timesIncorrect / timesAttempted
                timesIncorrect = this.DAMPING_VALUE * percentIncorrect
                timesAttempted = this.DAMPING_VALUE
            }
            questionData.timesAttempted += timesAttempted
            questionData.timesIncorrect += timesIncorrect
            questionHistory[question.key] = questionData
        } else {
            questionHistory[question.key] = questionObj
        }
    }

    getQuestionAnalysis () {
        return this.questionAnalysis
    }

    handleActions (action) {
        switch (action.type) {
        case 'FILTER_CHANGE' : {
            if (action.value.name === 'Schools') {
                this.handleSchoolAnalysis(action.value.option, this.path)
            }
            break
        }
        default:
        }
    }
}

const questionAnalysisStore = new QuestionAnalysisStore()
dispatcher.register(questionAnalysisStore.handleActions.bind(questionAnalysisStore))
export default questionAnalysisStore
