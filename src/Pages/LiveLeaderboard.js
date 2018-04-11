import React from 'react'
import { Table, Row, Button, FormGroup } from 'reactstrap'
import { compose } from 'recompose'

import LiveLeaderboardStore from '../Stores/LiveLeaderboardStore'
import * as LiveLeaderboardActions from '../Actions/LiveLeaderboardActions'
import Entry from '../Components/LiveLeaderboard/Entry'
import Filters from '../Components/Filters/Filters'
import withAuthorization from '../hoc/withAuthorization'
import withLoading from '../hoc/withLoading'
import * as auth from '../Constants/auth'

function ResetButton (props) {
    return (<Button id='reset-button' {...props}>Reset</Button>)
}

const ResetButtonWithLoading = withLoading(ResetButton)

class LiveLeaderboard extends React.Component {
    constructor () {
        super()
        this.state = {
            leaderboard: LiveLeaderboardStore.getCurrentLeaderboard(),
            loading: LiveLeaderboardStore.getLoading(),
            currentFilters: {}
        }
        this.getLeaderboard = this.getLeaderboard.bind(this)
        this.getFilters = this.getFilters.bind(this)
        LiveLeaderboardActions.loadLeaderboard(LiveLeaderboardStore.path)
        LiveLeaderboardActions.loadFilters(LiveLeaderboardStore.getPath())
    }

    componentWillMount () {
        LiveLeaderboardStore.on('change', this.getLeaderboard)
    }

    componentWillUnmount () {
        LiveLeaderboardStore.removeListener('change', this.getLeaderboard)
    }

    getLeaderboard () {
        this.setState({
            leaderboard: LiveLeaderboardStore.getCurrentLeaderboard(),
            loading: LiveLeaderboardStore.getLoading()
        })
    }

    resetLeaderboard () {
        LiveLeaderboardActions.resetLeaderboard(LiveLeaderboardStore.leaderboardPath)
    }

    // Converts the leaderboard object into a sorted array, sorted by score.
    sortLeaderboard () {
        // Build the array to be sorted that will contain all the leaderboard information
        let sortedLeaderboard = []
        const leaderboard = this.state.leaderboard
        for (var key in leaderboard) {
            if (leaderboard.hasOwnProperty(key)) {
                if (this.checkFilters(leaderboard[key])) {
                    sortedLeaderboard.push(leaderboard[key])
                }
            }
        }

        sortedLeaderboard.sort((a, b) => b.score - a.score)

        for (var i in sortedLeaderboard) {
            sortedLeaderboard[i].position = parseInt(i, 10) + 1
        }
        return sortedLeaderboard
    }

    checkFilters (entry) {
        const filters = this.state.currentFilters
        for (let i in filters) {
            let filter = filters[i]
            if (filter.name === 'Schools' && filter.option !== 'All' && entry.school !== filter.option) return false
            if ((filter.name === 'Subjects' || filter.name === 'Topics') && !entry.path.includes(filter.option)) return false
        }
        return true
    }

    getFilters (filters) {
        this.setState({currentFilters: filters})
    }

    render () {
        const leaderboard = this.sortLeaderboard()
        const loading = this.state.loading

        // Map every entry in the current leaderboard array into an entry component
        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} {...entry} />
        })

        return (
            <div>
                <Row className='page-header'>
                    <h1>Live Leaderboard</h1>
                </Row>
                <Row className='form-row align-items-center d-flex justify-content-around'>
                    <Filters getFilters={this.getFilters} />
                    <FormGroup>
                        <ResetButton isLoading={loading} onClick={() => this.resetLeaderboard()} />
                    </FormGroup>
                </Row>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>School</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Entries}
                        </tbody>
                    </Table>
                </Row>
            </div>
        )
    }
}

const authCondition = (authUser) => {
    return (!!authUser && auth.authDomain(authUser.email))
}

export default compose(
    withLoading,
    withAuthorization(authCondition)
)(LiveLeaderboard)
