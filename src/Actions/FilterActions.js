import dispatcher from '../dispatcher'

// Load all the filters that can be used by the leaderboard.  Topic filters will be
// subject specific.

export function setFilter (name, option) {
    dispatcher.dispatch({
        type: 'FILTER_CHANGE',
        value: {
            name: name,
            option: option }
    })
}
