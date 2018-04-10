import firebase from '../Constants/fire'
import React from 'react'
import PropTypes from 'prop-types'

const withAuthentication = (WrappedComponent) => {
    class _withAuthentication extends React.Component {
        constructor (props) {
            super(props)
            this.state = {
                authUser: null,
                lastUser: null
            }
        }

        getChildContext () {
            return {
                authUser: this.state.authUser,
                lastUser: this.state.lastUser
            }
        }

        componentDidMount () {
            firebase.auth().onAuthStateChanged((authUser) => {
                authUser
                    ? this.setState({
                        lastUser: this.state.authUser,
                        authUser: authUser
                    })
                    : this.setState({
                        lastUser: this.state.authUser,
                        authUser: null
                    })
            })
        }

        render () {
            return <WrappedComponent authUser={this.state.authUser} {...this.props} />
        }
    }

    _withAuthentication.childContextTypes = {
        authUser: PropTypes.object,
        lastUser: PropTypes.object
    }

    return _withAuthentication
}

export default withAuthentication
