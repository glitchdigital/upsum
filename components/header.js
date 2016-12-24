import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import UserMenu from '../components/user-menu'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.session = Session()
  }

  render(url) {
    return (
      <header>
        <Head>
          <link rel="stylesheet" href="/static/css/normalize.css"/>
          <link rel="stylesheet" href="/static/css/skeleton.css"/>
          <link rel="stylesheet" href="/static/css/main.css"/>
          <link rel="stylesheet" href="/static/css/font-awesome-animation.min.css"/>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <title>Upsum</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        </Head>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="six columns">
                <h1 className="title" ><a href="/" className="nostyle"><img src="/static/images/upsum-logo.png?v=1" alt="Upsum logo"/>Upsum</a></h1>
                <p><a href="/" className="title-slogan">The news, summed up</a></p>
              </div>
              <div className="six columns">
                <Provider store={this.session}>
                  <UserMenu />
                </Provider>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}