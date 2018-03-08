import React from 'react'
import { Table, Row } from 'reactstrap'

import LiveLeaderboardStore from '../Stores/LiveLeaderboardStore'
import Entry from './LiveLeaderboard/Entry'
import Filter from './LiveLeaderboard/Filter'
import * as LiveLeaderboardActions from '../Actions/LiveLeaderboardActions'

export default class LiveLeaderboard extends React.Component {
    constructor () {
        super()
        this.state = {
            leaderboard: LiveLeaderboardStore.getAll(),
            filters: LiveLeaderboardStore.getFilters()
        }
        this.getLeaderboard = this.getLeaderboard.bind(this)
        LiveLeaderboardActions.loadLeaderboard(LiveLeaderboardStore.leaderboardPath)
        LiveLeaderboardActions.listenToLeaderboard()
    }

    componentWillMount () {
        LiveLeaderboardStore.on('change', this.getLeaderboard)
    }

    componentWillUnmount () {
        LiveLeaderboardStore.removeListener('change', this.getLeaderboard)
    }

    getLeaderboard () {
        this.setState({
            leaderboard: LiveLeaderboardStore.getAll()
        })
    }

    render () {
        const { leaderboard, filters } = this.state

        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} {...entry} />
        })

        const Filters = filters.map((filter) => {
            return <Filter key={filter.name} {...filter} />
        })

        return (
            <div>
                <Row>
                    <h1>Live Leaderboard</h1>
                </Row>
                <Row className='d-flex justify-content-around'>
                    {Filters}
                </Row>
                <Row>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
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
