import React from 'react'

import TopNav from '../Components/Home/Nav'

export default class Home extends React.Component {
    render () {
        const { location } = this.props
        const containerStyle = {
            margtinTop: '60px'
        }

        return (
            <div>
                <TopNav location={location} />

                <div className='container' style={containerStyle}>
                    <div className='row'>
                        <div className='col-lg-12'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
