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
import moment from 'moment'

export default class extends Page {
  
  static async getInitialProps({ req, query }) {
    await super.getInitialProps({req})
    const session = Session(req)
    const questions = new Questions

    // Define URLs for sharing
    let shareUrl = 'https://upsum.news/about'
    let shareImageTwitter = 'https://upsum.news/static/images/upsum-logo-share-twitter.png'
    let shareImageFacebook = 'https://upsum.news/static/images/upsum-logo-share-facebook-v2.png'

    let dailyQuestions = await questions.search({ limit: 20, filter: '_created:date('+moment().format('YYYY-MM-DD')+')' })
    
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

  popup(e) {
    window.open(e.target.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
    e.preventDefault()
    return false
  }

  render() {
    let questions = []
    this.props.questions.map((question, i) => {
      if (moment(question['@dateCreated']) > moment().subtract(1, 'days')) {
        questions.push(question)
      }
    })

    return (
      <Layout>
        <Head>
          <title>Upsum Daily Breifing</title>
          <meta name="description" content="Questions raised about the news today"/>
        </Head>
        <div className="row">
          <div className="twelve columns">
            <h1 className="briefing"><span>Daily Briefing for {moment().format('Do MMMM, YYYY')}</span></h1>
          </div>
        </div>
        <div className="row">
          <div className="offset-by-two eight columns">
            {
              questions.map((question, i) => {
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
                    {imageTag}
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
                  <div className="buttons">
                    <a target="_blank" onClick={this.popup} className="button button-facebook" href={"http://www.facebook.com/sharer.php?u=" + encodeURIComponent('https://upsum.news/questions/'+question['@id'].split('/')[4]) + "&t=" + encodeURIComponent(question.name)} title="Share on Facebook..."><i className="fa fa-fw fa-lg fa-facebook"/> Share</a>
                    <a target="_blank" onClick={this.popup} className="button button-twitter" href={"https://twitter.com/share?url=" + encodeURIComponent('https://upsum.news/questions/'+question['@id'].split('/')[4]) + "&text=" + encodeURIComponent(question.name)}><i className="fa fa-fw fa-lg fa-twitter"/> Tweet</a>
                  </div>
                  <p className="muted" style={{marginBottom: 0, textAlign: 'right'}}>{i+1} of {questions.length}</p>
                </div>
              })
            }
            <p style={{marginTop: '40px', textAlign: 'center'}}><Link href="/"><a>That&#39;s all for today!</a></Link></p>
          </div>
        </div>
      </Layout>
    )
  }
}