import React from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import Home from './Pages/Home'

import registerServiceWorker from './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.css'

const root = document.getElementById('root')

ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Home} />
        </Switch>
    </BrowserRouter>
), root)

registerServiceWorker()
