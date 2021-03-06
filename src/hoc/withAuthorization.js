import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import firebase from '../Constants/fire'
import * as routes from '../Constants/routes'

const withAuthorization = (authCondition) => (Component) => {
    class WithAuthorization extends React.Component {
        componentDidMount () {
            firebase.auth().onAuthStateChanged(authUser => {
                if (!authCondition(authUser)) {
                    this.props.history.push(routes.SIGN_IN)
                }
            })
        }

        render () {
            return this.context.authUser ? <Component /> : null
        }
    }

    WithAuthorization.contextTypes = {
        authUser: PropTypes.object
    }

    WithAuthorization.propTypes = {
        history: PropTypes.object
    }

    return withRouter(WithAuthorization)
}

export default withAuthorization
