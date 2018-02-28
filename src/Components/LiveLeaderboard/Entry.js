import React from 'react'
import PropTypes from 'prop-types'

import styles from '../../site.css'

export default class Entry extends React.Component {
    render () {
        const {lastChanged} = this.props

        return (
            <tr id={this.props.uid} styleName={test}>
                <td>{this.props.position}</td>
                <td>{this.props.name}</td>
                <td>{this.props.score}</td>
            </tr>
        )
    }
}

Entry.propTypes = {
    uid: PropTypes.string,
    position: PropTypes.number,
    name: PropTypes.string,
    score: PropTypes.number,
    lastChanged: PropTypes.bool
}
