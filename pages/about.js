import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'
import Questions from '../models/questions'
import { Session } from '../models/session'
import Layout from '../components/layout'
import Page from '../components/page'
import QuestionCard from '../components/question-card'
import removeMarkdown from 'remove-markdown'

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
          <title>Upsum - About</title>
          <meta name="description" content="Find out more about upsum.news"/>
        </Head>
      
        <div className="row">
          <div className="offset-by-two eight columns">
            <h1 style={{textAlign: 'center', marginBottom: '30px'}}>About Upsum</h1>
            {
              this.props.questions.map((question, i) => {
                return <div key={i} className="question">
                    <h2><strong>{question.name}</strong></h2>
                    <div style={{fontStyle: 'oblique'}}>
                      <ReactMarkdown source={question.text || ''}/>
                    </div>
                    <div>
                      <p className="date-label">
                        <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question.acceptedAnswer.datePublished || question['@dateModified']} />
                      </p>
                    </div>
                    <div itemProp="text">
                      <ReactMarkdown source={(question.acceptedAnswer && question.acceptedAnswer.text) ? question.acceptedAnswer.text : "" }/>
                    </div>
                    <div style={{display: (question.acceptedAnswer.citation) ? 'block' : 'none'}}>
                      <h5>Source(s)</h5>
                      <div className="muted">
                        <ReactMarkdown source={question.acceptedAnswer.citation}/>
                     </div>
                   </div>
                </div>
              })
            }
            <p style={{marginTop: '40px', marginBottom: '0', textAlign: 'center'}}><Link href="/"><a>That&#39;s all!</a></Link></p>
          </div>
        </div>
      </Layout>
    )
  }
}