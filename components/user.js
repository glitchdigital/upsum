import Link from 'next/prefetch'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

export default connect(state => state)(class extends React.Component {

  constructor(props) {
    super(props)
  }
  
  handleLogout() {
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
    
    if (window.location)
      window.location = window.location
    
    return {}
  }
  
  render() {
    if (this.props.sessionId) {
      return (
        <div className="user">
          <p style={{margin: '5px 0'}}>
            Logged in as <strong>{this.props.name}</strong>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <Link href="/question/new">New Question</Link>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <a href="#" onClick={this.handleLogout} >Logout</a>
          </p>
        </div>
      )
    } else {
      return (
        <div className="user"></div>
      )
    }
  }
})
