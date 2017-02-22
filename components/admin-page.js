import React from 'react'
import Layout from '../components/layout'
import { Session } from '../models/session'

export default class extends React.Component {
  
  // Expose session to all pages
  static async getInitialProps({ req }) {
    const session = new Session({ req })
    return { session: await session.getSession() }
  }

  render() {
    var response
    switch (this.props.errorCode) {
      case 200: // Also display a 404 if someone explicitly requests /_error
      case 404:
        response = (
          <Layout>
            <h3>Page Not Found</h3>
            <p>The page <strong>{ this.props.url.pathname }</strong> does not exist.</p>
          </Layout>
        )
        break
      case 500:
        response = (
          <Layout>
            <h3>Internal Server Error</h3>
            <p>An internal server error occurred.</p>
          </Layout>
        )
        break
      default:
        response = (
          <Layout>
            <h3>HTTP { this.props.errorCode } Error</h3>
            <p>
              An <strong>HTTP { this.props.errorCode }</strong> error occurred while
              trying to access <strong>{ this.props.url.pathname }</strong>
            </p>
          </Layout>
        )
    }
    return response
  }
  
}