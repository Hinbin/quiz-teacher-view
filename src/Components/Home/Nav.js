import React from 'react'

import {
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
    Collapse
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
    render () {
        return (
            <Navbar dark color='primary' expand='md'>
                <NavbarBrand><NavLink href='/'>Quiz Teacher View</NavLink></NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className='mr-auto' navbar>
                        <NavItem>
                            <NavLink href='/LiveLeaderboard'>Live Leaderboard</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href='/QuestionAnalysis'>Question Analysis</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}
