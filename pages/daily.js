import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import moment from 'moment'
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

    let dailyQuestions = await questions.search({ limit: 50, filter: '_created:date('+moment().format('YYYY-MM-DD')+')' })
    
    return {
      id: query.id,
      questions: dailyQuestions,
      session: session.getState(),
      shareUrl: shareUrl,
      shareImage: shareImageTwitter,
      shareImageTwitter: shareImageTwitter,
      shareImageFacebook: shareImageFacebook
    }
  }

  render() {
    let questions = []
    this.props.questions.map((question, i) => {
      if (moment(question['@dateCreated']) > moment().subtract(1, 'days')) {
        questions.push(question)
      }
    })
    // If there are no questions for today show questions from last 48hrs
    if (questions.length === 0) {
      this.props.questions.map((question, i) => {
        if (moment(question['@dateCreated']) > moment().subtract(48, 'hours')) {
          questions.push(question)
        }
      })
    }
    // If there are no questions for last 48hrs show questions from last 72hrs
    if (questions.length === 0) {
      this.props.questions.map((question, i) => {
        if (moment(question['@dateCreated']) > moment().subtract(72, 'hours')) {
          questions.push(question)
        }
      })
    }

    return (
      <Layout>
        <Head>
          <title>Upsum Daily</title>
          <meta name="description" content="Questions raised about the news today"/>
        </Head>
        <Navbar breadcrumbs={[
          { name: 'Daily Briefing', href: '/daily' }
        ]}/>
        <div className="row">
          <div className="offset-by-one ten columns">
            <h1><span>Upsum Daily for {moment().format('D MMMM, YYYY')}</span></h1>
          </div>
        </div>
        <div className="row">
          <div className="offset-by-one ten columns">
            {
              questions.map((question, i) => {
                return (
                  <div key={`daily-${i}`} className="question">
                    <QuestionCard question={question} session={this.props.session} footer={i+1 + ' of ' + questions.length}/>
                  </div>
                )
              })
            }
            <p style={{marginTop: '40px', textAlign: 'center'}}><Link href="/"><a>That&#39;s all for today!</a></Link></p>
          </div>
        </div>
      </Layout>
    )
  }
}