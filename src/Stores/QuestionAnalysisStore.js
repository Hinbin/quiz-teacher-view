import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class QuestionAnalysisStore extends EventEmitter {
    constructor () {
        super()
        this.path = ['Computer Science', 'Overall']
        this.questionHistory = {}
        this.currentFilters = []
        this.filters = []
    }

    getQuestionHistory () {
        return this.questionHistory
    }

    getFilters () {
        return this.filters
    }

    getCurrentFilters () {
        return this.currentFilters
    }

    selectSchool (value) {
        // Remove any existing filters with the same name from the array
        this.currentFilters = this.currentFilters.filter((filter) => {
            if (filter.name !== 'Schools') {
                return true
            } else return false
        })

        // Push this new filter onto the array
        this.currentFilters.push(value.schoolName)
        this.questionHistory = value.questionHistory

        this.emit('change')
    }

    loadFilters (value) {
        this.filters = value
        this.emit('change')
    }

    handleActions (action) {
        console.log(action)
        switch (action.type) {
        case 'QUESTION_ANALYSIS_SCHOOL_SELECTED' : {
            this.selectSchool(action.value)
            break
        }
        case 'LOAD_FILTERS' : {
            this.loadFilters(action.value)
            break
        }
        default:
        }
    }
}

const questionAnalysisStore = new QuestionAnalysisStore()
dispatcher.register(questionAnalysisStore.handleActions.bind(questionAnalysisStore))
export default questionAnalysisStore
