import React from 'react'
import { Table, Row, Button } from 'reactstrap'

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

    resetLeaderboard () {
        LiveLeaderboardActions.resetLeaderboard(LiveLeaderboardStore.leaderboardPath)
    }

    render () {
        const { leaderboard, filters, currentFilters } = this.state

        // Map every entry in the current leaderboard array into an entry component
        const Entries = leaderboard.map((entry) => {
            return <Entry key={entry.uid} {...entry} />
        })

        // Display all filters that are currently defined.
        const Filters = filters.map((filter) => {
            let selected = currentFilters.filter((selectedFilter) => {
                return selectedFilter.name === filter.name
            })[0]
            if (selected === undefined) {
                if (filter.name === 'Schools') {
                    selected = 'All'
                } else if (filter.name === 'Subjects') {
                    selected = LiveLeaderboardStore.leaderboardPath[0]
                } else if (filter.name === 'Topics') {
                    selected = LiveLeaderboardStore.leaderboardPath[1]
                }
            } else {
                selected = selected.option
            }

            return <Filter key={filter.name} selected={selected} selectFilter={this.selectFilter} {...filter} />
        })

        return (
            <div>
                <Row className='page-header'>
                    <h1>Live Leaderboard</h1>
                </Row>
                <Row className='d-flex justify-content-around filter-block'>
                    {Filters}
                    <Button onClick={() => this.resetLeaderboard()}>Reset</Button>
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
