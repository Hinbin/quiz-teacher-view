import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import TopNav from './Components/TopNav'
import LiveLeaderboard from './Components/LiveLeaderboard'

import registerServiceWorker from './registerServiceWorker'

import './site.css'
import 'bootstrap/dist/css/bootstrap.css'

const root = document.getElementById('root')

ReactDOM.render((
    <BrowserRouter>
        <div>
            <TopNav />
            <div className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <Switch>
                            <Route path='/' component={LiveLeaderboard} />
                            <Route path='/LiveLeaderboard' component={LiveLeaderboard} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    </BrowserRouter>
), root)

registerServiceWorker()
