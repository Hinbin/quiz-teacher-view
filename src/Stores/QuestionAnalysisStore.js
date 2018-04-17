import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'
import firebase from '../Constants/fire'

class QuestionAnalysisStore extends EventEmitter {
    constructor () {
        super()
        this.questionData = {}
        this.questionAnalysis = []
        this.path = ['Computer Science', 'Overall']
        this.oldPath = []
    }

    getPath () {
        return this.path
    }

    handleSchoolAnalysis (schoolName, path) {
        this.questionData = {}

        let db = firebase.database()

        // Get a list of the users that belong to the school chosen
        db.ref('/users').orderByChild('school').equalTo(schoolName).once('value').then((snapshot) => {
            return snapshot
        }).then((userSnapshot) => {
            let promiseArray = []
            // For each user in that school...
            userSnapshot.forEach((user) => {
                // Get the answer history for the user for the subject selected
                let key = 'questionAnalysis/' + user.key + '/' + path[0] + '/GCSE/'
                let promise = db.ref(key).once('value').then((subjectSnapshot) => {
                    // Then go through each topic and submit each question for analysis
                    subjectSnapshot.forEach((topicSnapshot) => {
                        this.addQuestion(topicSnapshot)
                    })
                })

                promiseArray.push(promise)
            })

            Promise.all(promiseArray).then(() => this.orderAnalysis())
        })
    }

    orderAnalysis () {
        let questionData = this.questionData
        let questionAnalysis = []
        for (let i in questionData) {
            let {correct, incorrect} = questionData[i]
            questionData[i].percentCorrect = correct / (correct + incorrect)
            questionAnalysis.push(questionData[i])
        }
        questionAnalysis.sort((a, b) => { return a.percentCorrect > b.percentCorrect })

        this.questionAnalysis = questionAnalysis

        this.emit('change')
    }

    addQuestion (question) {
        let questionObj = question.val()
        let { questionHash, correct } = questionObj
        if (this.questionData[questionHash] === undefined) {
            this.questionData[questionHash] = { correct: 0, incorrect: 0 }
        }

        correct ? this.questionData[questionHash].correct++ : this.questionData[questionHash].incorrect++
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
