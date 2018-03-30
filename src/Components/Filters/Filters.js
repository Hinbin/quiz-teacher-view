import React from 'react'
import PropTypes from 'prop-types'
import FilterStore from '../../Stores/FilterStore'
import * as FilterActions from '../../Actions/FilterActions'
import Filter from './Filter'

export default class Filters extends React.Component {
    constructor (props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            dropdownOpen: false,
            filters: FilterStore.getFilters(),
            currentFilters: FilterStore.getCurrentFilters()
        }
        this.getFilterStore = this.getFilterStore.bind(this)
        FilterActions.loadFilters()
    }

    componentWillMount () {
        FilterStore.on('change', this.getFilterStore)
    }

    componentWillUnmount () {
        FilterStore.removeListener('change', this.getFilterStore)
    }

    getFilterStore () {
        this.props.getFilters(FilterStore.getCurrentFilters())
        this.setState({
            filters: FilterStore.getFilters(),
            currentFilters: FilterStore.getCurrentFilters()
        })
    }

    toggle () {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    render () {
        const {filters, currentFilters} = this.state

        let filterArray = []

        // Display all filters that are currently defined.
        filters.map((filter) => {
            let selected = currentFilters.filter((selectedFilter) => {
                return selectedFilter.name === filter.name
            })[0]
            if (selected === undefined) {
                if (filter.name === 'Schools') {
                    selected = 'Select School'
                }
            } else {
                selected = selected.option
            }
            filterArray.push(<Filter key={filter.name} selected={selected} {...filter} />)
        })

        return (
            filterArray
        )
    }
}

Filters.propTypes = {
    getFilters: PropTypes.func
}
