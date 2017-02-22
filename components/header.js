import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { Provider } from 'react-redux'
import { Session } from '../models/session'
import MenuBar from '../components/menubar'
import Search from '../components/search'
import Package from '../package.json'
import inlineCSS from '../css/main.scss'

export default class extends React.Component {

  constructor (props) {
    super(props)
    this.session = Session()
  }

  render(url) {
    let stylesheet
    if (process.env.NODE_ENV === 'production') {
      // In production, serve pre-built CSS file from /assets/{version}/main.css
      let pathToCSS = '/assets/' + Package.version + '/main.css'
      stylesheet = <link rel="stylesheet" type="text/css" href={pathToCSS}/>
    } else {
      // In development, serve CSS inline (with live reloading) with webpack
      stylesheet = <style dangerouslySetInnerHTML={{__html: inlineCSS}}/>
    }

    return (
      <header>
        <Head>
          <title>Upsum</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
          {stylesheet}
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