import dispatcher from '../dispatcher'

export function loadLeaderboard () {
    dispatcher.dispatch({type: 'LOAD_LEADERBOARD'})
}
