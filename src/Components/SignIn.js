import React from 'react'
import firebase from 'firebase'
import PropTypes from 'prop-types'

import * as routes from '../Constants/routes'
import * as auth from '../Constants/auth'

import GoogleButton from 'react-google-button'

class SignIn extends React.Component {
    componentWillMount () {
        firebase.auth().onAuthStateChanged((authUser) => {
            this.checkDomain(authUser)
        })
    }

    checkDomain (authUser) {
        if (authUser) {
            if (auth.authDomain(authUser.email)) {
                this.props.history.push(routes.LANDING)
            } else {
                firebase.auth().currentUser.delete()
            }
        }
    }

    handleSignIn () {
        let provider = new firebase.auth.GoogleAuthProvider()

        if (this.context.authUser) {
            provider.setCustomParameters({
                prompt: 'select_account'
            })
        }

        firebase.auth().signInWithRedirect(provider)
    }

    SignInNormal () {
        return (
            <div className='py-4 row justify-content-center'>
                <GoogleButton id='sign-in-button' onClick={() => this.handleSignIn()}>Sign In</GoogleButton>
            </div>
        )
    }

    SignInWarning () {
        return (
            <div>
                <div className='py-4 row justify-content-center'>
                    <p>Please ensure you sign in with your Outwood.com e-mail</p>
                </div>
                <div className='py-4 row justify-content-center'>
                    <GoogleButton id='sign-in-button' onClick={() => this.handleSignIn()}>Sign In</GoogleButton>
                </div>
            </div>
        )
    }

    render () {
        const user = this.context.lastUser
        return (
            user && !auth.authDomain(user.email)
                ? this.SignInWarning()
                : this.SignInNormal()
        )
    }
}

SignIn.contextTypes = {
    authUser: PropTypes.object,
    lastUser: PropTypes.object
}

SignIn.propTypes = {
    history: PropTypes.object
}

export default SignIn
