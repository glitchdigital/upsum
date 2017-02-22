import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import MenuBar from '../components/menubar'
import Search from '../components/search'
import Package from '../package.json'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.session = Session()
  }

  render(url) {
    return (
      <header>
        <Head>
          <link rel="stylesheet" href={"/assets/"+Package.version+"/main.css"}/>
          <title>Upsum</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
          <style>{`
            body {
              margin: 0;
              font-family: sans-serif;
              color: #444;
              background-color: #eee;
              font-size: 18px;
              line-height: 28px;
            }
            .logo {
              text-align: center;
            }
            .logo img {
              margin-top: 20px;
              margin-bottom: 10px;
              height: auto;
              width: 90%;
              border: 0;
            }
            @media (min-width: 660px) {
              body {
                background-color: #e5e5e5;
              }
              .header .container {
                padding: 0 30px;
              }
              .container {
                background-color: #eee;
                padding: 10px 30px 30px 30px;
              }
              .logo {
                text-align: left;
              }
              .logo img {
                height: 124px;
                width: 350px;
              }
            }
          `}</style>
        </Head>
        <Provider store={this.session}>
          <MenuBar />
        </Provider>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="six columns">
                <div className="logo">
                  <Link href="/"><a><img src="/static/images/upsum-logo-2017-02-01.png" alt="Upsum - The news, summed up"/></a></Link>
                </div>
              </div>
              <div className="six columns">
                  <Search />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}