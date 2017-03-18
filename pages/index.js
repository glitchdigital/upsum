import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Questions from '../models/questions'
import Layout from '../components/layout'
import Page from '../components/page'
import QuestionCardPreview from '../components/question-card-preview'


export default class extends Page {
  
  static async getInitialProps({ req }) {
    await super.getInitialProps({req})
    const questions = new Questions
    const results = await questions.search({ limit: 50 })
    return { questions: results }
  }

  componentDidMount() {
    super.componentDidMount()
    /*
    if (!window.googleadsenseloaded) {
      window.googleadsenseloaded = true
      if (!adsbygoogle) var adsbygoogle
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8690794745241806",
        enable_page_level_ads: true
      })
    }
    */
  }

  getPreviewCardClassName(question, column, row) {
    let className = 'question-card-preview-small'

    if (column == null) {
      // On single column views (mobile) 'column' is null
      if (row < 6) {
        className = 'question-card-preview'
      }
    } else {
      // The first couple of rows (most recent questions) are larger
      if (row < 2) {
        className = 'question-card-preview'
      } else {
        // All Q's that don't have images are small cards (unless in first 2 rows)
        if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
          // Assign a couple of larger cards in each row
          if (column == 0 && (row == 4 || row == 8 || row == 12)) {
            className = 'question-card-preview'
          }
          if (column == 1 && (row == 6 || row == 9 || row == 13)) {
            className = 'question-card-preview'
          }
          if (column == 2 && (row == 5 || row == 10 || row == 14)) {
            className = 'question-card-preview'
          }
        }
      }
    }
    return className;
  }
  
  render() {
    // Split questions into seperate columns
    const numberOfColumns = 3
    const questions = []
    let currentList = 0
    this.props.questions.forEach((question) => {

      // Skip questions without answers
      //if (!question.acceptedAnswer || !question.acceptedAnswer.text)
      //  return
      
      if (currentList == numberOfColumns) currentList = 0
      if (!questions[currentList]) questions[currentList] = []
      questions[currentList++].push(question)
    })

    return (
      <Layout>
        <Head>
          <title>Upsum - The news, summed up</title>
          <meta name="description" content="Find accurate, quick and simple answers to your questions about the news."/>
          <meta property="og:title" content="Upsum - The news, summed up"/>
          <meta property="og:url" content="https://upsum.news"/>
          <meta property="og:description" content="Find accurate, quick and simple answers to your questions about the news."/>
          <meta property="og:image" content="https://upsum.news/static/images/upsum-logo-share-twitter.png"/>
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:site" content="upsumnews"/>
          <meta name="twitter:title" content="Upsum - The news, summed up"/>
          <meta name="twitter:description" content="Find accurate, quick and simple answers to your questions about the news."/>
          <meta name="twitter:image" content="https://upsum.news/static/images/upsum-logo-share-twitter.png"/>
        </Head>
        <div>
          <div className="row">
            <div className="twelve columns">
              <div className="navbar">
                <Link href="/"><a className="unstyled"><i className="fa fa-fw fa-home"/> Home</a></Link>
                <i className="fa fa-fw fa-chevron-right seperator"/>
                <span>Trending Questions</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="twelve columns">
              <Link href="/about"><a><div className="alert">
                <i className="fa fa-lg fa-fw fa-info-circle"/>
                <span className="link">Hello! We are Upsum and we give accurate, quick and simple answers to questions about the news</span>
              </div></a></Link>
            </div>
          </div>
          <div className="hidden-desktop">
            <div className="row question-cards">
              <div className="columns twelve">
                {
                  this.props.questions.map((question, i) => {
                    return <div key={i}><QuestionCardPreview question={question} className={this.getPreviewCardClassName(question, null, i)}/></div>
                  })
                }
              </div>
            </div>
          </div>
          <div className="hidden-mobile">
            <div className="row question-cards">
              <div className="columns four first">
                {
                  questions[0].map((question, i) => {
                    return <div key={i}><QuestionCardPreview question={question} className={this.getPreviewCardClassName(question, 0, i)}/></div>
                  })
                }
              </div>
              <div className="columns four">
                {
                  questions[1].map((question, i) => {
                    return <div key={i}><QuestionCardPreview question={question} className={this.getPreviewCardClassName(question, 1, i)}/></div>
                  })
                }
              </div>
              <div className="columns four last">
                {
                  questions[2].map((question, i) => {
                    return <div key={i}><QuestionCardPreview question={question} className={this.getPreviewCardClassName(question, 2, i)}/></div>
                  })
                }
              </div>
              <div className="question-cards-fade"/>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
}