import React, { Component } from 'react'
import './App.css'

import { Route, BrowserRouter, Switch } from 'react-router-dom'

import TopNav from './Components/TopNav'
import LiveLeaderboard from './Components/LiveLeaderboard'
import withAuthentication from './Components/withAuthentication'
import SignIn from './Components/SignIn'
import * as routes from './Constants/routes'

class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <div>
                    <TopNav />
                    <div className='container'>
                        <div className='row'>
                            <div className='col-lg-12'>
                                <Switch>
                                    <Route exact path={routes.LANDING} component={LiveLeaderboard} />
                                    <Route path={routes.LEADERBOARD} component={LiveLeaderboard} />
                                    <Route path={routes.SIGN_IN} component={SignIn} />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default withAuthentication(App)
