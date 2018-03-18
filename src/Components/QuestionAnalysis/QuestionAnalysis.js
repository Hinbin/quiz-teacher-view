import React from 'react'
import {Row} from 'reactstrap'

import withAuthorization from '../withAuthorization'
import Filter from '../Filter'
import * as QuestionAnalysisActions from '../../Actions/QuestionAnalysisActions'
import QuestionAnalysisStore from '../../Stores/QuestionAnalysisStore'

import * as auth from '../../Constants/auth'

class QuestionAnalysis extends React.Component {
    constructor () {
        super()
        this.state = {
            filters: QuestionAnalysisStore.getFilters(),
            currentFilters: QuestionAnalysisStore.getCurrentFilters(),
            questionAnalysis: QuestionAnalysisStore.getQuestionHistory()
        }
        this.getQuestionAnalysis = this.getQuestionAnalysis.bind(this)
        QuestionAnalysisActions.loadQuestionAnalysis()
    }

    componentWillMount () {
        QuestionAnalysisStore.on('change', this.getQuestionAnalysis)
    }

    componentWillUnmount () {
        QuestionAnalysisStore.removeListener('change', this.getQuestionAnalysis)
    }

    getQuestionAnalysis () {
        this.setState({
            filters: QuestionAnalysisStore.getFilters(),
            currentFilters: QuestionAnalysisStore.getCurrentFilters(),
            questionHistory: QuestionAnalysisStore.getQuestionHistory()
        })
    }

    selectFilter (selected) {
        QuestionAnalysisActions.getAnalysis(selected, 'Computer Science')
    }

    render () {
        const { filters, currentFilters } = this.state
        const Filters = filters.map((filter) => {
            let selected = currentFilters.filter((selectedFilter) => {
                return selectedFilter.name === filter.name
            })[0]
            return <Filter key={filter.name} selected={selected} selectFilter={this.selectFilter} {...filter} />
        })

        return (
            <div>
                <Row className='page-header'>
                    <h1>Question Analysis</h1>
                </Row>
                <Row className='form-row align-items-center d-flex justify-content-around'>
                    {Filters}
                </Row>
            </div>
        )
    }
}

const authCondition = (authUser) => {
    return (!!authUser && auth.authDomain(authUser.email))
}

export default withAuthorization(authCondition)(QuestionAnalysis)
