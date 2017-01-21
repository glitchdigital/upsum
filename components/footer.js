import Link from 'next/prefetch'
import React from 'react'
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
      loginButton = <span>| <a href="/login"><i className="fa fa-sign-in"></i> Contributors</a></span>
    }

    return (
      <footer>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <hr/>
              <p>&copy; <Link href="/">Upsum</Link> {new Date().getYear() + 1900} {loginButton} (<strong>Beta 1.4.6</strong>)</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}