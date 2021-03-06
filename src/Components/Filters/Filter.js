import React from 'react'
import PropTypes from 'prop-types'
import * as FilterActions from '../../Actions/FilterActions'
import {Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Label, FormGroup} from 'reactstrap'

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

    selectFilter (name, option) {
        FilterActions.setFilter(name, option)
    }

    render () {
        let {options} = this.props
        const dropDownID = this.props.name.replace(' ', '-') + '-dropdown'
        let DropdownItems = options.map((option, index) => {
            const idName = this.props.name + '-' + option.replace(' ', '-')
            return <DropdownItem key={index} id={idName} onClick={() => this.selectFilter(this.props.name, option)}>{option}</DropdownItem>
        })
        return (
            <FormGroup>
                <Label for={dropDownID}>{this.props.name}</Label>
                <Dropdown id={dropDownID} isOpen={this.state.dropdownOpen} toggle={this.toggle} className='filter'>
                    <DropdownToggle caret>
                        {this.props.selected}
                    </DropdownToggle>
                    <DropdownMenu>
                        {DropdownItems}
                    </DropdownMenu>
                </Dropdown>
            </FormGroup>
        )
    }
}

Filter.propTypes = {
    selected: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array
}
