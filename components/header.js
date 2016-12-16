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
              margin: 0;
              font-family: sans-serif;
              color: #444;
              background-color: #ddd;
            }
            .header .container {
              padding: 0 20px;
            }
            .container {
              background-color: #eee;
              padding: 20px 20px;
            }
            hr {
              height: 0;
              border: 0;
              margin: 0 0 10px 0;
              border-top: 4px solid #ddd;
            }
            h1.title {
              margin: 30px 0 0 0;
              white-space: nowrap; 
              font-weight: 500;
              font-size: 60px;
              line-height: 70px;
            }
            h1.title img {
              position: relative;
              top: -5px;
              height: 80px;
              width: 80px;
              vertical-align: middle;
            }
            p {
              font-size: 18px;
              line-height: 28px;
            }
            p.muted {
              color: #888;
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
            #search input {
              border: none;
              background-color: #eee;
              text-align: right;
              border-radius: 100px;
              font-size: 20px;
              line-height: 20px;
            }
            #search input:focus {
              background-color: #fff;
            }
            #search .fa-microphone {
              position: relative;
              top: -8px;
              background: #ddd;
              color: #888;
              line-height: 50px;
              padding: 0 15px;
              margin-left: 10px;
              border-radius: 100px;
            }
            #search .fa-microphone:hover,
            #search .fa-microphone:focus {
              background: red;
              color: #fff;
              cursor: pointer;
            }
          `}</style>
        </Head>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="six columns">
                <h1 className="title" ><a href="/" className="nostyle"><img src="/static/images/upsum-logo.png" alt="Upsum logo"/>Upsum</a></h1>
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