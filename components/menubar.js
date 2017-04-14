import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

export default connect(state => state)(class extends React.Component {

  handleLogout(e) {
    e.preventDefault()
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
  }
  
  render() {
    if (this.props.sessionId) {
      return (
        <div className="menubar">
          <div className="container">
            <div className="row">
              <div className="twelve columns">
                <p style={{margin: '5px 0', float: 'left'}}>
                  <Link href="/"><a className="unstyled">upsum.news <span className="beta">BETA</span></a></Link>
                </p>
                <p style={{margin: '0', float: 'right'}}>
                  <Link href="/question/new" as="/questions/new"><a className="button button-primary">New</a></Link>
                  &nbsp;
                  <a className="button" href="#" onClick={this.handleLogout} >Sign out</a>
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
                  <Link href="/"><a className="unstyled">upsum.news <span className="beta">BETA</span></a></Link>
                </p>
                <p style={{margin: '5px 0', float: 'right'}}>
                  <a className="unstyled" href="http://fb.me/upsumnews"><i className="fa fa-fw fa-facebook-square"/><span className="hidden-mobile"> fb.me/upsumnews</span></a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="http://twitter.com/upsumnews"><i className="fa fa-fw fa-twitter"/><span className="hidden-mobile"> @upsumnews</span></a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="https://upsum.news/email"><i className="fa fa-fw fa-envelope"/><span className="hidden-mobile"> Newsletter</span></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})
