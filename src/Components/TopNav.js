import React from 'react'
import firebase from 'firebase'
import PropTypes from 'prop-types'

import * as routes from '../Constants/routes'

import {
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    Collapse,
    Button
} from 'reactstrap'

export default class TopNav extends React.Component {
    constructor (props) {
        super(props)
        this.toggle = this.toggle.bind(this)
        this.state = {
            isOpen: false
        }
    }

    toggle () {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    signOut () {
        firebase.auth().signOut()
    }

    navbarLoggedIn () {
        return (
            <Navbar dark expand='md'>
                <NavbarBrand href='/'>Quiz Teacher View</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className='mr-auto' navbar>
                        <NavItem>
                            <NavLink href={routes.LEADERBOARD}>Live Leaderboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={routes.QUESTION_ANALYSIS}>Question Analysis</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
                <Button className='mr-sm-2' id='sign-out-button' onClick={() => this.signOut()}>Sign Out</Button>
            </Navbar>
        )
    }

    navbarLoggedOut () {
        return (
            <Navbar dark expand='md'>
                <NavbarBrand href='/'>Quiz Teacher View</NavbarBrand>
            </Navbar>
        )
    }

    render () {
        return (
            this.context.authUser
                ? this.navbarLoggedIn()
                : this.navbarLoggedOut()
        )
    }
}

TopNav.contextTypes = {
    authUser: PropTypes.object
}
