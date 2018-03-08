import React from 'react'
import PropTypes from 'prop-types'
import * as LiveLeaderboardActions from '../../Actions/LiveLeaderboardActions'
import {Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'reactstrap'

export default class Filter extends React.Component {
    constructor (props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            dropdownOpen: false,
            selectedItem: this.props.name
        }
    }

    toggle () {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    selectItem (option) {
        this.setState({
            selectedItem: option
        })
        LiveLeaderboardActions.setFilter(option, this.props.name)
    }

    render () {
        let {options} = this.props
        let DropdownItems = options.map((option, index) => {
            return <DropdownItem key={index} onClick={() => this.selectItem(option)}>{option}</DropdownItem>
        })
        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.state.selectedItem}
                </DropdownToggle>
                <DropdownMenu>
                    {DropdownItems}
                </DropdownMenu>
            </Dropdown>
        )
    }
}

Filter.propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
}
