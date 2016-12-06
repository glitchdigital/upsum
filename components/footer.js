import React from 'react'
import Link from 'next/link'
import { Session } from '../models/session'

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
      loginButton = <span>| <Link href="/login">Admin Login</Link></span>
    }

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <hr/>
              <p>&copy; <Link href="/">Upsum</Link> {new Date().getYear() + 1900} {loginButton}</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}