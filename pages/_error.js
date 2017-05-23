import React from 'react'
import Layout from '../components/layout'

export default class Error extends React.Component {
  
  static getInitialProps({ req, res, xhr, err }) {
    const errorCode = res ? res.statusCode : (xhr ? xhr.status : null)
    return { errorCode, err }
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
      default:
        response = (
          <Layout>
            <h3>HTTP { this.props.errorCode } Error</h3>
            <p>
              An <strong>HTTP { this.props.errorCode }</strong> error occurred while
              trying to access <strong>{ this.props.url.pathname }</strong>
            </p>
            <h4>Additional information about this error</h4>
            <pre>{JSON.stringify(this.props)}</pre>
            <pre>{JSON.stringify(err)}</pre>
          </Layout>
        )
    }
    return response
    
  }
}