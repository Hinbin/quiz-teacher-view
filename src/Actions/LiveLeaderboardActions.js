import dispatcher from '../dispatcher'

export function loadLeaderboard (path, oldPath) {
    dispatcher.dispatch({
        type: 'LEADERBOARD_LOAD',
        value: {
            path: path,
            oldPath: oldPath }
    })
}

export function resetLeaderboard () {
    dispatcher.dispatch({
        type: 'LEADERBOARD_RESET'
    })
}

export function loadFilters (path) {
    dispatcher.dispatch({
        type: 'FILTER_LOAD_SCHOOLS_ALL'
    })

    dispatcher.dispatch({
        type: 'FILTER_LOAD_SUBJECTS_TOPICS',
        value: path
    })
}
