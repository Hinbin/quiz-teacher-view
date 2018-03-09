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
                <td id={this.props.uid + '-pos'}>{this.props.position}</td>
                <td id={this.props.uid + '-name'}>{this.props.name}</td>
                <td id={this.props.uid + '-school'}>{this.props.school}</td>
                <td id={this.props.uid + '-score'}>{this.props.score}</td>
            </tr>
        )
    }
}

Entry.propTypes = {
    uid: PropTypes.string,
    position: PropTypes.number,
    name: PropTypes.string,
    score: PropTypes.number,
    school: PropTypes.string,
    lastChanged: PropTypes.bool
}
