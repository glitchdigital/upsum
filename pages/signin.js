import Link from 'next/link'
import React from 'react'
import Layout from '../components/layout'
import Page from '../components/page'
import Questions from '../models/questions'
import { Session } from '../models/session'

export default class extends Page {
  
  static async getInitialProps({ req }) {
    const session = Session(req)
    return { session: session.getState() }
  }
  
  constructor(props) {
     super(props)
     this.state = {
        name: '',
        email: '',
        sessionId: '',
        isLoggedIn: false,
        admin: false 
     }
     this.handleChange = this.handleChange.bind(this)
     this.handleSubmit = this.handleSubmit.bind(this)
   }
  
  handleChange(event) {
    if (event.target.name == "name")
      this.state.name = event.target.value.trim()

    if (event.target.name == "apiKey")
      this.state.sessionId = event.target.value.trim()
      
    this.setState(this.state)
  }

  handleSubmit(event) {
    if (this.state.name && this.state.sessionId) {
      const session = Session()
      session.dispatch({ type: 'LOGIN', session: this.state })
      window.location = "/"
      // @TODO pushTo doesn't work here for some reason
      //this.props.url.pushTo("/")
    } else {
      alert("Please enter your name and provide an access key")
    }
    event.preventDefault()
  }

  render() {
    if (this.props.session.sessionId) {
      return (
        <Layout>
          <div className="row">
            <div className="twelve columns">
              <p style={{textAlign: 'center', padding: '50px 0 25px 0'}}>You are signed in as <strong>{this.props.session.name}</strong></p>
              <p style={{textAlign: 'center'}}>
                 <Link href="/"><span className="button">Home</span></Link>
              </p>
            </div>
          </div>
        </Layout>
      )
    } else {
      return (
        <Layout>
          <div className="row">
            <div className="three columns">&nbsp;</div>
            <div className="six columns">
              <br/>
              <form method="post" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                <h4>Sign In</h4>
                <p>
                  Authorized contributors can sign-in with an access key.
                </p>
                <label htmlFor="name">Your name</label>
                <input name="name" className="u-full-width" type="text" placeholder="John Smith" id="name" />
                <label htmlFor="apiKey">Your Access Key</label>
                <input name="apiKey" className="u-full-width" type="text" placeholder="XXXX-XXXX-XXXX-XXXX" id="apiKey" />
                <p className="u-pull-right">
                  <Link href="/"><a className="button">Cancel</a></Link>
                  &nbsp;
                  <button type="submit" className="button-primary ">Sign in</button>
                </p>
              </form>
            </div>
            <div className="two columns">&nbsp;</div>
          </div>
        </Layout>
      )
    }
  }
  
}