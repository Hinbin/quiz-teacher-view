import { EventEmitter } from 'events'

import dispatcher from '../dispatcher'

class FilterStore extends EventEmitter {
    constructor () {
        super()
        this.path = ['Computer Science', 'Overall']
        this.currentFilters = []
        this.filters = []
    }

    handleActions (action) {
        switch (action.type) {
        case 'LOAD_SCHOOL_FILTER' : {
            this.loadSchoolFilters(action.value)
            break
        }

        case 'FILTER_CHANGE' : {
            this.filterChange(action.value)
            break
        }

        case 'LOAD_WEEKLY_SNAPSHOT' : {
            this.loadTopicsAndSubjects(action.value)
            break
        }

        default:
        }
    }

    loadTopicsAndSubjects (value) {
        let subjectArray = [this.path[0]]
        let topicArray = [this.path[1]]
        // Loop through our top level subjects and get the subject names
        const subjects = value
        for (let subject in subjects) {
            if (!subjectArray.includes(subject)) subjectArray.push(subject)
        }

        const topics = subjects[this.path[0]]

        if (topics !== undefined) {
            for (let topic in topics) {
                if (!topicArray.includes(topic)) topicArray.push(topic)
            }
        }

        this.filters.push(
            {
                name: 'Subjects',
                options: subjectArray
            },
            {
                name: 'Topics',
                options: topicArray
            }
        )
        this.emit('change')
    }

    loadSchoolFilters (value) {
    // Have to perform a deep copy of this array to modify it
        let newFilters = JSON.parse(JSON.stringify(value))
        // Add the 'All' option for schools
        for (let i in newFilters) {
            if (newFilters[i].name === 'Schools') {
                let newArray = newFilters[i]
                newArray.options = ['All', ...newArray.options]
                newFilters[i] = newArray
            }
        }

        this.filters.unshift(newFilters[0])
        this.emit('change')
    }

    getFilters () {
        return this.filters
    }

    getCurrentFilters () {
        return this.currentFilters
    }

    filterChange (value) {
        // Remove any existing filters with the same name from the array
        this.currentFilters = this.currentFilters.filter((filter) => {
            if (filter.name !== value.name) {
                return true
            } else return false
        })

        // Push this new filter onto the array
        this.currentFilters.push(value)

        if (value.name === 'Subjects') {
            this.path[0] = value.option
            this.path[1] = 'Overall'
            this.changeTopics(value.option)
        } else if (value.name === 'Topics') {
            this.path[1] = value.option
        }
        this.emit('change')
    }

    changeTopics (subject) {
        let topicOptions = []
        const subjectBoard = this.initialLeaderboard[subject]
        if (subjectBoard === null) return
        for (let key in subjectBoard) {
            topicOptions.push(key)
        }

        this.filters[2] = {
            name: 'Topics',
            options: topicOptions
        }

        this.leaderboardFilterChange({
            name: 'Topics',
            option: 'Overall'
        })
    }
}

const filterStore = new FilterStore()
dispatcher.register(filterStore.handleActions.bind(filterStore))
export default filterStore
