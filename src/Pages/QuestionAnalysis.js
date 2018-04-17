import React from 'react'
import {Row} from 'reactstrap'

import withAuthorization from '../hoc/withAuthorization'
import Filters from '../Components/Filters/Filters'
import * as QuestionAnalysisActions from '../Actions/QuestionAnalysisActions'
import QuestionAnalysisStore from '../Stores/QuestionAnalysisStore'

import * as auth from '../Constants/auth'

class QuestionAnalysis extends React.Component {
    constructor () {
        super()
        this.state = {
            path: QuestionAnalysisStore.getPath(),
            questionAnalysis: QuestionAnalysisStore.getQuestionAnalysis(),
            currentFilters: {}
        }
        this.getFilters = this.getFilters.bind(this)
        this.getQuestionAnalysis = this.getQuestionAnalysis.bind(this)
        QuestionAnalysisActions.loadQuestionAnalysis(this.state.path)
    }

    componentWillMount () {
        QuestionAnalysisStore.on('change', this.getQuestionAnalysis)
    }

    componentWillUnmount () {
        QuestionAnalysisStore.removeListener('change', this.getQuestionAnalysis)
    }

    getFilters (filters) {
        this.setState({currentFilters: filters})
    }

    getQuestionAnalysis () {
        this.setState({
            questionAnalysis: QuestionAnalysisStore.getQuestionHistory()
        })
    }

    render () {
        return (
            <div>
                <Row className='page-header'>
                    <h1>Question Analysis</h1>
                </Row>
                <Row className='form-row align-items-center d-flex justify-content-around'>
                    <Filters getFilters={this.getFilters} />
                </Row>
            </div>
        )
    }
}

const authCondition = (authUser) => {
    return (!!authUser && auth.authDomain(authUser.email))
}

export default withAuthorization(authCondition)(QuestionAnalysis)
