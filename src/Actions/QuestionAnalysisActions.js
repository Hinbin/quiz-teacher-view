import dispatcher from '../dispatcher'

// Live analysis?

export function loadQuestionAnalysis (path) {
    dispatcher.dispatch({
        type: 'FILTER_LOAD_SCHOOLS'
    })

    dispatcher.dispatch({
        type: 'FILTER_LOAD_FROM'
    })

    dispatcher.dispatch({
        type: 'FILTER_LOAD_SUBJECTS_TOPICS',
        value: path
    })
}
