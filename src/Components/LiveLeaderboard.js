import React from 'react'
import { Table, Row, Button, FormGroup } from 'reactstrap'

import LiveLeaderboardStore from '../Stores/LiveLeaderboardStore'
import Entry from './LiveLeaderboard/Entry'
import Filters from './Filters/Filters'
import * as LiveLeaderboardActions from '../Actions/LiveLeaderboardActions'
import withAuthorization from './withAuthorization'
import * as auth from '../Constants/auth'

class LiveLeaderboard extends React.Component {
    constructor () {
        super()
        this.state = {
            leaderboard: LiveLeaderboardStore.getCurrentLeaderboard(),
            currentFilters: {}
        }
        this.getLeaderboard = this.getLeaderboard.bind(this)
        this.getFilters = this.getFilters.bind(this)
        LiveLeaderboardActions.loadLeaderboard(LiveLeaderboardStore.leaderboardPath)
    }

    componentWillMount () {
        LiveLeaderboardStore.on('change', this.getLeaderboard)
    }

    componentWillUnmount () {
        LiveLeaderboardStore.removeListener('change', this.getLeaderboard)
    }

    getLeaderboard () {
        this.setState({
            leaderboard: LiveLeaderboardStore.getCurrentLeaderboard()
        })
    }

    selectFilter (option, name) {
        const oldPath = LiveLeaderboardStore.leaderboardPath.slice()
        LiveLeaderboardActions.setFilter(option, name, oldPath)
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
                        <Button id='reset-button' onClick={() => this.resetLeaderboard()}>Reset</Button>
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

export default withAuthorization(authCondition)(LiveLeaderboard)
