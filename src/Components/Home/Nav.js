import React from "react";
import ReactDOM from "react-dom";

import { Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem  } from 'reactstrap';

export default class Nav extends React.Component {
    constructor() {
        super()
    }

    render() {
        return <Navbar/>
    }

}