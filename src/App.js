import React, { Component } from 'react'
import './App.css'

import { Route, BrowserRouter, Switch } from 'react-router-dom'

import TopNav from './Components/TopNav'
import LiveLeaderboard from './Pages/LiveLeaderboard'
import QuestionAnalysis from './Pages/QuestionAnalysis'
import withAuthentication from './hoc/withAuthentication'
import SignIn from './Pages/SignIn'
import * as routes from './Constants/routes'
import withLoading from './hoc/withLoading'

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
                                    <Route exact path={routes.QUESTION_ANALYSIS} component={QuestionAnalysis} />
                                    <Route exact path={routes.LEADERBOARD} component={LiveLeaderboard} />
                                    <Route path={routes.SIGN_IN} component={SignIn} />
                                    <Route exact path={routes.LANDING} component={LiveLeaderboard} />
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
