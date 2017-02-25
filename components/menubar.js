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
                <p style={{float: 'left', margin: '10px 0 0 0'}}>
                <Link href="/"><a><i className="fa fa-fg fa-home"/> UPSUM</a></Link> <span className="beta">BETA</span>
                &nbsp;| <span className="muted"><i className="fa fa-fw fa-user"></i> <strong>{this.props.name}</strong></span>
                </p>
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
        <div className="menubar">
          <div className="container">
            <div className="row">
              <div className="twelve columns">
                <p style={{margin: '5px 0', float: 'left'}}>
                  <Link href="/"><a><i className="fa fa-fg fa-home"/> UPSUM</a></Link> <span className="beta">BETA</span>
                </p>
                <p style={{margin: '5px 0', float: 'right'}}>
                  <a href="http://news.us15.list-manage1.com/subscribe?u=90920d6af43c4d73f91ca0878&id=3f929585fa"><i className="fa fa-fw fa-envelope-o"/> Subscribe</a>
                </p>
              </div>
            </div>
          </div>
        </div>

      )
    }
  }
})
