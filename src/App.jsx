import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage.jsx'
import AboutPage from './components/about/AboutPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="app-container">
          <div className="main-layout">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<div className="content-page"><h2>Contact</h2></div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
