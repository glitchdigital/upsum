import React from 'react'
import ReactGA from 'react-ga'

if (typeof window !== 'undefined') {
  ReactGA.initialize('UA-92465819-2')
}

export default class extends React.Component {

  static async getInitialProps({ req }) {
    return {}
  }
  
  constructor(props) {
    super(props)
    this.updateGoogleAnalytics()
  }
  
  componentWillReceiveProps(nextProps) {
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
    this.updateGoogleAnalytics()
  }
  
  // Update Google Analytics on page load (both on first load & with new props)
  updateGoogleAnalytics() {
    if (typeof window !== 'undefined') {
      // @FIXME Setting a delay so that we fire only after the route has changed
      // (Otherwise page contents not always reflected correctly)
      setTimeout(() => {
        ReactGA.set({ page: window.location.pathname })
        ReactGA.pageview(window.location.pathname)
      }, 500)
    }
  }

}