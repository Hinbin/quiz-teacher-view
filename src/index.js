import React from 'react'
import ReactDOM from 'react-dom'

import registerServiceWorker from './registerServiceWorker'
import App from './App'

import './Styles/index.css'

const root = document.getElementById('root')

ReactDOM.render((
    <App />
), root)

registerServiceWorker()
