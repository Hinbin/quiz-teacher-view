import React from "react"

import Nav from "../Components/Home/Nav"

export default class Home extends React.Component {
    constructor() {
        super()
    }

    render() {
        const { location } = this.props;
        const containerStyle = {
            margtinTop: "60px"
        }

        return (
            <div>
                <Nav location={location} />

                <div class="container" style={containerStyle}>
                    <div class="row">
                        <div class="col-lg-12">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}