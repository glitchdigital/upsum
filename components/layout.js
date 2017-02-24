import React from 'react'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import Header from '../components/header'
import Footer from '../components/footer'
import MenuBar from '../components/menubar'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.session = Session()
  }

  static propTypes() {
    return {
      children: React.PropTypes.object.isRequired
    }
  }

  render() {
    return (
      <div>
        <Provider store={this.session}>
          <MenuBar />
        </Provider>
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