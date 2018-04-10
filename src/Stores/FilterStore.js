import { EventEmitter } from 'events'

import firebase from '../fire'

import dispatcher from '../dispatcher'

class FilterStore extends EventEmitter {
    constructor () {
        super()
        this.currentFilters = []
        this.filters = []
        this.weeklyLeaderboard = {}
    }

    handleActions (action) {
        switch (action.type) {
        case 'FILTER_RESET' : {
            break
        }
        case 'FILTER_LOAD_SCHOOLS_ALL' : {
            this.loadSchoolFilters(true)
            break
        }

        case 'FILTER_LOAD_SCHOOLS' : {
            this.loadSchoolFilters(false)
            break
        }

        case 'FILTER_LOAD_SUBJECTS_TOPICS' : {
            this.loadSubjects(action.value)
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

    getWeeklyLeaderboard () {
        let db = firebase.database()
        if (Object.keys(this.weeklyLeaderboard).length === 0) {
            return db.ref('weeklyLeaderboard/').once('value').then((snapshot) => {
                this.weeklyLeaderboard = snapshot.val()
            })
        } else {
            return Promise.resolve()
        }
    }

    loadSubjects (path) {
        this.getWeeklyLeaderboard().then(() => {
            let subjectArray = [path[0]]
            let topicArray = [path[1]]
            // Loop through our top level subjects and get the subject names
            const subjects = this.weeklyLeaderboard
            for (let subject in subjects) {
                if (!subjectArray.includes(subject)) subjectArray.push(subject)
            }

            const topics = subjects[path[0]]

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

            this.currentFilters.push(
                {
                    name: 'Subjects',
                    option: path[0]
                },
                {
                    name: 'Topics',
                    option: path[1]
                }
            )

            this.emit('change')
        })
    }

    loadSchoolFilters (includeAllOption) {
        const db = firebase.database()
        db.ref('schools/').once('value').then((schoolSnapshot) => {
            return schoolSnapshot
        }).then((schoolSnapshot) => {
            // Look through all the schools and then add them to the array.  Only add unique
            // schools so we don't get duplicates
            const schools = schoolSnapshot.val()
            let schoolArray = []

            if (includeAllOption) schoolArray.push('All')

            for (let i in schools) {
                let school = schools[i]
                if (!schoolArray.includes(school)) schoolArray.push(school)
            }

            this.filters.unshift({
                name: 'Schools',
                options: schoolArray})

            this.emit('change')
        })
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
            this.changeTopics(value.option)
        }

        this.emit('change')
    }

    changeTopics (subject) {
        let topicOptions = []
        const subjectBoard = this.weeklyLeaderboard[subject]
        if (subjectBoard === null) return
        for (let key in subjectBoard) {
            topicOptions.push(key)
        }

        // Remove the "topics" filter
        this.filters = this.filters.filter(filter => filter.name !== 'Topics')

        this.filters.push({
            name: 'Topics',
            options: topicOptions
        })
    }
}

const filterStore = new FilterStore()
dispatcher.register(filterStore.handleActions.bind(filterStore))
export default filterStore
