import React from 'react'
import { Table } from 'reactstrap'

import LiveLeaderboardStore from '../Stores/LiveLeaderboardStore'
import Entry from './LiveLeaderboard/Entry'
import * as LiveLeaderboardActions from '../Actions/LiveLeaderboardActions'

export default class LiveLeaderboard extends React.Component {
    constructor () {
        super()
        this.state = {
            leaderboard: LiveLeaderboardStore.getAll()
        }
        this.getLeaderboard = this.getLeaderboard.bind(this)
        LiveLeaderboardActions.loadLeaderboard()
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
        const { leaderboard } = this.state

        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} name={entry.uid} {...entry} />
        })

        return (
            <div>
                <h1>Live Leaderboard</h1>
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
            </div>
        )
    }
}
