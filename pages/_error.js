import React from 'react'
import Page from '../layouts/main'
import { Session } from '../models/session'

export default class Error extends React.Component {
  
  static getInitialProps({ req, res, xhr }) {
    const session = Session(req)
    const errorCode = res ? res.statusCode : xhr.status
    return { errorCode }
  }
  
  render() {
    var response
    switch (this.props.errorCode) {
      case 200: // Also display a 404 if someone explicitly requests /_error
      case 404:
        response = (
          <Page>
            <h3>Page Not Found</h3>
            <p>The page <strong>{ this.props.url.pathname }</strong> does not exist.</p>
          </Page>
        )
        break
      case 500:
        response = (
          <Page>
            <h3>Internal Server Error</h3>
            <p>An internal server error occurred.</p>
          </Page>
        )
        break
      default:
        response = (
          <Page>
            <h3>HTTP { this.props.errorCode } Error</h3>
            <p>
              An <strong>HTTP { this.props.errorCode }</strong> error occurred while
              trying to access <strong>{ this.props.url.pathname }</strong>
            </p>
          </Page>
        )
    }
    return response
    
  }
}