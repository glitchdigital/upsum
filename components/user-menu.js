import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { Session } from '../models/session'

module.exports = connect(state => state)(React.createClass({
  handleLogout: function() {
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
    
    if (window.location)
      window.location = window.location
    
    return {}
  },
  render: function() {
    if (this.props.sessionId) {
      return (
        <div style={{paddingTop: '20px', textAlign: 'right'}}>
          <p style={{margin: '5px 0'}}>
            Logged in as <strong>{this.props.name}</strong>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <a href="#" onClick={this.handleLogout} >Logout</a>
          </p>
          <p>
            <Link href="/question/new"><span className="button button-primary"><i className="fa fa-fw fa-plus"></i> New Question</span></Link>
          </p>
        </div>
      )
    } else {
      return (
        <p></p>
      )
    }
    
  }
}));