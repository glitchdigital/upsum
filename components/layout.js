import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default class extends React.Component {

  static propTypes() {
    return {
      children: React.PropTypes.object.isRequired
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="body">
          <div className="container">
            { this.props.children }
          </div>
        </div>
        <Footer />
      </div>
    )
  }

}