import React from 'react'
import { Table } from 'reactstrap'

import LiveLeaderboardStore from '../stores/LiveLeaderboardStore'
import Entry from './LiveLeaderboard/Entry'

export default class LiveLeaderboard extends React.Component {
    constructor () {
        super()
        this.state = {
            leaderboard: LiveLeaderboardStore.getAll()
        }
    }

    componentWillMount () {
        LiveLeaderboardStore.on('change', this.getLeaderboard)
    }

    componentWillUnmount () {
        LiveLeaderboardStore.removeListener('change', this.getPerson)
    }

    getLeaderboard () {
        this.setState({
            leaderboard: LiveLeaderboardStore.getAll()
        })
    }

    render () {
        const { leaderboard } = this.state

        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} {...entry} />
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
