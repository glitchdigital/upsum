import React from 'react'
import ReactGA from 'react-ga'
import { Session } from '../models/session'

if (typeof window !== 'undefined') {
  ReactGA.initialize('UA-92465819-2')
}

export default class extends React.Component {

  static async getInitialProps({ req }) {
    const session = Session(req)
    return { session: session.getState() }
  }
  
  constructor(props) {
    super(props)
  }
  
  componentWillReceiveProps(nextProps) {
    this.updateGoogleAnalytics()
    // Force scroll to top when loading new data in current page template
    if (typeof window !== 'undefined')
      window.scrollTo(0, 0)
  }
  
  componentDidMount() {
    this.updateGoogleAnalytics()
    // Force scroll to top when navigating between pages
    if (typeof window !== 'undefined')
      window.scrollTo(0, 0)
  }
  
  componentDidUpdate() {
  }
  
  // Update Google Analytics on page load (both on first load & with new props)
  updateGoogleAnalytics() {
    try {
      if (this.props.sessionId) {
        return
      }
      if (typeof window !== 'undefined') {
        
        if (window.location.hostname === "localhost" ||
            window.location.hostname === "beta.upsum.news") {
          return
        }
        
        // @FIXME We should set page title as a prop on the layout and use
        // that here when sending the 'title' to Google Analytics.
        //
        // Current workaround:
        // We use a 100ms delay so that we fire only after the route has changed
        // (otherwise page title may not have updated yet and could be wrong).
        setTimeout(() => {
          ReactGA.ga('set', 'title', document.title)
          ReactGA.ga('set', 'page', window.location.pathname)
          ReactGA.pageview(window.location.pathname)
        }, 100)
      }
    } catch(err) {
      console.log("updateGoogleAnalytics Exception", err)
    }
  }

}