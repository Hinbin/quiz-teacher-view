import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class QuestionAnalysisStore extends EventEmitter {
    constructor () {
        super()
        this.questionHistory = {}
    }

    getQuestionHistory () {
        return this.questionHistory
    }

    filterChange (value) {
        this.emit('change')
    }

    handleActions (action) {
        switch (action.type) {
        case 'QUESTION_ANALYSIS_SCHOOL_SELECTED' : {
            this.selectSchool(action.value)
            break
        }
        case 'QUESTION_ANALYSIS_FILTER_CHANGE' : {
            this.filterChange(action.value)
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
