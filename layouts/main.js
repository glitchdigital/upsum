import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default ({ children }) => (
  <div>
    <Header />
    <div className="body">
      <div className="container">
        { children }
      </div>
    </div>
    <Footer />
  </div>
)