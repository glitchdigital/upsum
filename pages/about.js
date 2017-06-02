import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Questions from '../models/questions'
import { Session } from '../models/session'
import Layout from '../components/layout'
import Page from '../components/page'
import Navbar from '../components/navbar'
import QuestionCard from '../components/question-card'

export default class extends Page {
  
  static async getInitialProps({ req, query }) {
    await super.getInitialProps({req})
    const session = Session(req)
    const questions = new Questions

    // Define URLs for sharing
    let shareUrl = 'https://upsum.news/about'
    let shareImageTwitter = 'https://upsum.news/static/images/upsum-logo-share-twitter.png'
    let shareImageFacebook = 'https://upsum.news/static/images/upsum-logo-share-facebook-v2.png'

    let upsumQuestions = await questions.search({ limit: 10, name: "Upsum" })
    upsumQuestions.reverse()
    
    return {
      id: query.id,
      questions: upsumQuestions,
      session: session.getState(),
      shareUrl: shareUrl,
      shareImage: shareImageTwitter,
      shareImageTwitter: shareImageTwitter,
      shareImageFacebook: shareImageFacebook
    }
  }
  
  render() {
    return (
      <Layout>
        <Head>
          <title>About Upsum</title>
          <meta name="description" content="The goal of Upsum is to answer questions people have about the news as accurately, quickly and simply as possible."/>
        </Head>
        <Navbar breadcrumbs={[
          { name: 'About Upsum', href: '/about' }
        ]}/>
        <div className="row">
          <div className="offset-by-one ten columns">
            <h1><span>About Upsum</span></h1>
            {
              this.props.questions.map((question, i) => {
                return (
                  <div key={i} className="question">
                    <QuestionCard question={question} session={this.props.session} footer={i+1 + ' of ' + this.props.questions.length}/>
                  </div>
                )
              })
            }
            <p style={{marginTop: '40px', textAlign: 'center'}}><Link href="/"><a>That&#39;s all there is to know!</a></Link></p>
          </div>
        </div>
      </Layout>
    )
  }
}