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
                  <Link href="/"><a className="unstyled"><i className="fa fa-home"/><span className="hidden-mobile"> Upsum</span></a></Link> <span className="beta">BETA</span>
                  &nbsp;<span className="hidden-mobile"><i className="fa fa-fw fa-user"></i> <strong>{this.props.name}</strong></span>
                </p>
                <p style={{margin: '5px 0', float: 'right'}}>
                  <Link href="/question/new"><a className="button button-primary">New</a></Link>
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
                  <Link href="/"><a className="unstyled"><i className="fa fa-home"/><span className="hidden-mobile"> Upsum</span></a></Link> <span className="beta">BETA</span>
                </p>
                <p style={{margin: '5px 0', float: 'right'}}>
                  <a className="unstyled" href="http://twitter.com/upsumnews"><i className="fa fa-fw fa-twitter"/> Follow</a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="http://news.us15.list-manage1.com/subscribe?u=90920d6af43c4d73f91ca0878&id=3f929585fa"><i className="fa fa-fw fa-envelope"/> Subscribe</a>
                </p>
              </div>
            </div>
          </div>
        </div>

      )
    }
  }
})
