import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default ({ children }) => (
  <div>
    <Header />
    <div className="container">
      <div className="row">
        <div className="twelve columns">
          { children }
        </div>
      </div>
    </div>
    <Footer />
  </div>
)