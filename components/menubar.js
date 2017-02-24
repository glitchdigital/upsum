import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

export default connect(state => state)(class extends React.Component {

  handleLogout() {
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
  }
  
  render() {
    if (this.props.sessionId) {
      return (
        <div className="menubar">
          <div className="container">
            <div className="row">
              <div className="six columns">
                <p style={{float: 'left', margin: '10px 0 0 0'}} className="muted">Signed in as <i className="fa fa-fw fa-user"></i> <strong>{this.props.name}</strong></p>
              </div>
              <div className="six columns">
                <p style={{margin: '5px 0'}}>
                  <Link href="/question/new"><a className="button button-primary">New Question</a></Link>
                  &nbsp;
                  <a className="button" href="#" onClick={this.handleLogout} >Logout</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
})
