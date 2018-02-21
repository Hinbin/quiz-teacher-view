import React from 'react'
import {
    Nav
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
            <Nav className='navbar navbar-expand-md navbar-dark bg-primary fixed-top'>
                <a className='navbar-brand' href='#'>Teacher View</a>

                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarsExampleDefault' aria-controls='navbarsExampleDefault'
                  aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon' />
                </button>

                <div className='collapse navbar-collapse' id='navbarsExampleDefault'>
                    <ul className='navbar-nav mr-auto' id='main-nav-bar'>
                        <li className='nav-item'>
                            <a className='nav-link' href='#' onClick='loadQuizPage()'>Revision Quiz
                                <span className='sr-only'>(current)</span>
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href='#' onClick='runMyQuiz()'>My Quizzes
                                <span className='sr-only'>(current)</span>
                            </a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href='#' onClick='runLeaderboard()'>Leaderboard
                                <span className='sr-only'>(current)</span>
                            </a>
                        </li>
                    </ul>
                    <a className='nav-link disabled' href='#' />
                </div>
            </Nav>
        )
    }
}
