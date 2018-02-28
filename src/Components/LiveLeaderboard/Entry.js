import React from 'react'
import PropTypes from 'prop-types'

export default class Entry extends React.Component {
    render () {
        const {lastChanged} = this.props
        let className = ''
        if (lastChanged) {
            className += 'lastChanged'
        }

        return (
            <tr id={this.props.uid} className={className}>
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
