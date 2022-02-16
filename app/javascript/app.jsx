import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
    return (
        <div>Hello, Rails 7!</div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    const rootEl = document.getElementById('app')
    ReactDOM.render(<App/>, rootEl)
})