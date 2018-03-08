import React from 'react'
import PropTypes from 'prop-types'
import {Dropdown, DropdownItem, DropdownToggle, DropdownMenu} from 'reactstrap'

export default class Filter extends React.Component {
    constructor (props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            dropdownOpen: false
        }
    }

    toggle () {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    selectFilter (option) {
        this.props.selectFilter(option, this.props.name)
    }

    render () {
        let {options} = this.props
        let DropdownItems = options.map((option, index) => {
            return <DropdownItem key={index} onClick={() => this.selectFilter(option)}>{option}</DropdownItem>
        })
        return (
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret>
                    {this.props.selected}
                </DropdownToggle>
                <DropdownMenu>
                    {DropdownItems}
                </DropdownMenu>
            </Dropdown>
        )
    }
}

Filter.propTypes = {
    selected: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    selectFilter: PropTypes.func
}
