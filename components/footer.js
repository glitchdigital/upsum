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
              <p style={{marginBottom: '10px'}}>
                &copy; <Link href="/"><a>Upsum</a></Link> {new Date().getYear() + 1900} v{Package.version} {loginButton}
                <span style={{float: 'right'}} ><a href="/rss.xml"><i className="fa fa-rss"/> RSS Feed</a></span>
              </p>
              <p style={{marginBottom: '10px'}}>
                Upsum articles are published under the Creative Commons <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> licence.
              </p>
              <p style={{marginBottom: '10px'}}>
                Published by <a href="http://glitch.digital">GLITCH.DIGITAL LIMITED</a>, registered in England & Wales as Company number 09942832.
              </p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}