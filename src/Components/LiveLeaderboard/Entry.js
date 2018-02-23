import React from 'react'
import PropTypes from 'prop-types'

export default class Entry extends React.Component {
    render () {
        return (
            <tr id={this.props.uid}>
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
    score: PropTypes.number
}
