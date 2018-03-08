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
            filters: LiveLeaderboardStore.getFilters(),
            currentFilters: LiveLeaderboardStore.getCurrentFilters()
        }
        this.getLeaderboard = this.getLeaderboard.bind(this)
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
            leaderboard: LiveLeaderboardStore.getAll(),
            filters: LiveLeaderboardStore.getFilters(),
            currentFilters: LiveLeaderboardStore.getCurrentFilters()
        })
    }

    selectFilter (option, name) {
        const oldPath = LiveLeaderboardStore.leaderboardPath.slice()
        LiveLeaderboardActions.setFilter(option, name)

        if (name === 'Subjects' || name === 'Topics') {
            LiveLeaderboardActions.loadLeaderboard(LiveLeaderboardStore.leaderboardPath, oldPath)
        }
    }

    render () {
        const { leaderboard, filters, currentFilters } = this.state

        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} {...entry} />
        })

        const Filters = filters.map((filter) => {
            let selected = currentFilters.filter((selectedFilter) => {
                return selectedFilter.name === filter.name
            })[0]
            if (selected === undefined) {
                selected = filter.name
            } else {
                selected = selected.option
            }
            return <Filter key={filter.name} selected={selected} selectFilter={this.selectFilter} {...filter} />
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
