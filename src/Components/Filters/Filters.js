import React from 'react'
import PropTypes from 'prop-types'
import FilterStore from '../../Stores/FilterStore'
import Filter from './Filter'

class Filters extends React.Component {
    constructor (props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            dropdownOpen: false,
            filters: FilterStore.getFilters(),
            currentFilters: FilterStore.getCurrentFilters()
        }
        this.getFilterStore = this.getFilterStore.bind(this)
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
        for (let i in filters) {
            let filter = filters[i]
            let selected = currentFilters.filter((selectedFilter) => {
                return selectedFilter.name === filter.name
            })[0]
            if (selected === undefined) {
                selected = filter.default
            } else {
                selected = selected.option
            }
            filterArray.push(<Filter key={filter.name} selected={selected} {...filter} />)
        }

        return (
            filterArray
        )
    }
}

Filters.propTypes = {
    getFilters: PropTypes.func,
    selectFilter: PropTypes.func
}

export default Filters
