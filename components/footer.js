import Link from 'next/link'
import React from 'react'
import { Session } from '../models/session'
import Package from '../package.json'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.session = Session().getState()
  }

  render() {
    let loginButton
    if (this.session.sessionId) {
      loginButton = <span/>
    } else {
      loginButton = <span>&nbsp; <Link href="/signin"><a><i className="fa fa-sign-in"></i> Sign-in</a></Link> &nbsp;</span>
    }

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <hr/>
              <p>&copy; <Link href="/"><a>Upsum</a></Link> {new Date().getYear() + 1900} <i>version {Package.version} beta</i> {loginButton} <a href="/rss.xml"><i className="fa fa-rss"/> RSS Feed</a></p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}