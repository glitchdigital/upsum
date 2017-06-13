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
                  Signed in as <Link href="/"><a className="unstyled"> {this.props.name}</a></Link>
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
        <div className="menubar hidden-desktop">
          <div className="container">
            <div className="row">
              <div className="twelve columns">
                <p style={{margin: '5px 0', float: 'left', paddingTop: 2.5}}>
                  <Link href="/"><a className="unstyled">UPSUM.NEWS</a></Link>
                </p>
                <p style={{margin: '5px 0', float: 'right'}} className="menubar-links">
                  <a className="unstyled" href="http://fb.me/upsumnews"><i className="fa fa-fw fa-facebook"/></a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="http://twitter.com/upsumnews"><i className="fa fa-fw fa-twitter"/></a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="https://upsum.news/email"><i className="fa fa-fw fa-envelope"/></a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})
