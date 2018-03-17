import util from 'util'

var leaderboardCommands = {
    el: function (elementName, data) {
        var element = this.elements[elementName.slice(1)]
        return util.format('select[', element.selector, '] value=[', data, ']')
    },
    changeFilter: function (filterName, selection) {
        let dropdownSelector = selection.replace(' ', '-')
        return (
            this.click(filterName)
                .click('button[id*=' + dropdownSelector + ']')
        )
    },
    resetFilters: function () {
        return (
            this.changeFilter('@schoolFilter', 'All')
                .changeFilter('@subjectFilter', 'All')
        )
    },
    reset: function () {
        this.click('@resetButton')
        this.api.pause(1000)
    }
}

module.exports = {
    commands: [leaderboardCommands],

    url: function () {
        return this.api.launchUrl + '/leaderboard'
    },

    elements: {
        schoolFilter: {
            selector: '#Schools-dropdown'
        },
        subjectFilter: {
            selector: '#Subjects-dropdown'
        },
        topicFilter: {
            selector: '#Topics-dropdown'
        },
        resetButton: {
            selector: '#reset-button'
        }
    }
}
