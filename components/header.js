import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import UserMenu from '../components/user-menu'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.session = Session()
  }

  render() {
    return (
      <header>
        <Head>
          <link rel="stylesheet" href="/static/css/normalize.css"/>
          <link rel="stylesheet" href="/static/css/skeleton.css"/>
          <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
          <style>{`
            body {
              margin: 10px 20px;
              font-family: sans-serif;
              color: #444;
              background-color: #eee;
            }
            hr {
              height: 1px;
              border: 0;
              border-top: 1px solid #ccc;
            }
            h1 {
              margin: 30px 0;
            }
            p {
              font-size: 18px;
              line-height: 28px;
            }
            a {
              text-decoration: none;
            }
            a.nostyle {
              color: #444;
              text-decoration: none;
            }
            footer a,
            footer p {
              color: #888;
              text-decoration: none;
            }
          `}</style>
        </Head>
        <div className="container">
          <div className="row">
            <div className="six columns">
              <h1><a href="/" className="nostyle"><i className="fa fa-lg fa-arrow-circle-o-up"></i> Upsum</a></h1>
            </div>
            <div className="six columns">
              <Provider store={this.session}>
                <UserMenu />
              </Provider>
            </div>
          </div>
        </div>
      </header>
    )
  }
}