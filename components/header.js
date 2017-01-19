import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import User from '../components/user'
import Search from '../components/search'

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
          <link rel="stylesheet" href="/static/css/main.css?v=1.3.8"/>
          <link rel="stylesheet" href="/static/css/font-awesome-animation.min.css"/>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <title>Upsum</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
          <style>{`
            body {
              margin: 0;
              font-family: sans-serif;
              color: #444;
              background-color: #eee;
            }
            @media (min-width: 660px) {  
              body {
                background-color: #ddd;
              }
              .header .container {
                padding: 0 20px;
              }
              .container {
                background-color: #eee;
                padding: 0 20px 20px 20px;
              }
            }
          `}</style>
        </Head>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="six columns">
                <Link href="/"><h1 className="title"><img style={{height: '110px', width: '110px'}} src="/static/images/upsum-logo.png?v=1" alt="Upsum logo"/>Upsum</h1></Link>
                <Link href="/"><p className="title-slogan">The news, summed up</p></Link>
              </div>
              <div className="six columns">
                  <Search />
              </div>
            </div>
            <div className="row">
              <div className="twelve columns">
                <Provider store={this.session}>
                  <User />
                </Provider>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}