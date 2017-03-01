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
          <title>About Upsum</title>
          <meta name="description" content="Find out more about upsum.news"/>
        </Head>
      
        <div className="row">
          <div className="offset-by-two eight columns">
            <h1 className="briefing"><span>About Upsum</span></h1>
            {
              this.props.questions.map((question, i) => {
                let imageTag
                if (question.image && question.image.url) {
                  let fileName = question.image.url.split('/').pop()
                  let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
                  imageTag = 
                    <div>
                      <div className="question-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div>
                      <div className="question-image-text">
                        <p className="image-caption">{question.image.caption}</p>
                        <p className="image-credit">Image credit: <a target="_blank" href={question.image.publisher.url || 'https://upsum.news'}>{question.image.publisher.name || 'Upsum'}</a></p>
                      </div>
                    </div>
                }
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
                   <p className="muted" style={{marginBottom: 0, textAlign: 'right'}}>{i+1} of {this.props.questions.length}</p>
                </div>
              })
            }
            <p style={{marginTop: '40px', textAlign: 'center'}}><Link href="/"><a>That&#39;s all there is to know!</a></Link></p>
          </div>
        </div>
      </Layout>
    )
  }
}