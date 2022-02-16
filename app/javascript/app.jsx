import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import Dashboard from './Dashboard';
import {Characters, Character} from './characters'

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="characters" element={<Characters />} />
                <Route path="characters/:id" element={<Character />}/>
            </Routes>
        </div>
    )
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
        document.getElementById('app')
    );
})