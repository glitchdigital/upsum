import React from 'react'

export default class extends React.Component {

  static async getInitialProps({ req }) {
    // Force scroll to top when navigating between pages
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
    return {}
  }

}