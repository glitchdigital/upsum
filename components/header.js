import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Search from '../components/search'
import Package from '../package.json'
import inlineCSS from '../css/main.scss'

export default class extends React.Component {

  // Never redraw header
  shouldComponentUpdate(nextProps, nextState) {
    return false
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
          <meta property="fb:pages" content="272576466512375"/>
          <meta property="fb:app_id" content="243413202788046"/>
          <script src="/static/js/postscribe-2.0.8.min.js"/>
          {stylesheet}
        </Head>
        <div className="header">
          <div className="container">
            <div className="row">
              <div className="five columns">
                <div className="beta">BETA</div>
                <div className="logo">
                  <Link href="/"><a><img src="https://res.cloudinary.com/glitch-digital-limited/image/upload/h_150,w_150/v1489885960/upsum-publisher-logo_e6x61w.png" alt="Upsum - The news, summed up"/></a></Link>
                  <div className="text">
                    <h1><Link href="/"><a>Upsum</a></Link></h1>
                    <p><Link href="/"><a>The news, summed up</a></Link></p>
                  </div>
                </div>
              </div>
              <div className="seven columns">
                <p style={{margin: '10px 0', float: 'right'}} className="hidden-mobile">
                  <a className="unstyled" href="http://fb.me/upsumnews"><i className="fa fa-fw fa-facebook-square"/> fb.me/upsumnews</a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="http://twitter.com/upsumnews"><i className="fa fa-fw fa-twitter"/> @upsumnews</a>
                  &nbsp; &nbsp; 
                  <a className="unstyled" href="https://upsum.news/email"><i className="fa fa-fw fa-envelope"/> Newsletter</a>
                </p>
                <Search />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}