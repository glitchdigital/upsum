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
                background-color: #e5e5e5;
              }
              .header .container {
                padding: 0 30px;
              }
              .container {
                background-color: #eee;
                padding: 10px 30px 30px 30px;
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
                <Link href="/"><a href="/"><img style={{marginTop: '20px', marginBottom: '10px', height: '116px', width: '330px', border: '0'}} src="/static/images/upsum-logo.png" alt="Upsum - The news, summed up"/></a></Link>
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