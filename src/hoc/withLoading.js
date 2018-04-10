import React from 'react'
const withLoading = (WrappedComponent) => {
    class _withLoading extends React.Component {
        constructor (props) {
            super(props)
            this.state = {
                isLoading: true
            }
        }

        render () {
            if (!this.state.isLoading) return (<WrappedComponent isLoading {...this.props} />)
            return (<p>Be Hold, fetching data may take some time :)</p>)
        }
    }

    return _withLoading
}

export default withLoading
