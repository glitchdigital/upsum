import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import Layout from '../../components/layout'
import Page from '../../components/page'
import QuestionCard from '../../components/question-card'
import removeMarkdown from 'remove-markdown'

export default class extends Page {
  
  static async getInitialProps({ req, query }) {
    await super.getInitialProps({req})
    const session = Session(req)
    const questions = new Questions
    
    // Get question
    const question = await questions.get(query.id)
    
    // When running on the server we get related questions in getInitialProps() 
    // When running in the browser we can fetch them after the page load in
    // componentDidMount() to improve page rendering time.
    
    let relatedQuestions = []
    if (typeof window === 'undefined' && question['@id'])
      relatedQuestions = await this.getRelatedQuestions(question)

    // Define URLs for sharing
    let shareUrl
    let shareImageTwitter
    let shareImageFacebook
    if (question['@id']) {
      if (typeof window === 'undefined') {
        // Server side render
        shareUrl = 'https://' + req.hostname + '/questions/' + query.id
        shareImageTwitter = 'https://' + req.hostname + '/static/images/upsum-logo-share-twitter.png'
        shareImageFacebook = 'https://' + req.hostname + '/static/images/upsum-logo-share-facebook-v2.png'
      } else {
        // Client side render
        shareUrl = 'https://' + window.location.host + '/questions/' + query.id
        shareImageTwitter = 'https://' + window.location.host + '/static/images/upsum-logo-share-twitter.png'
        shareImageFacebook = 'https://' + window.location.host + '/static/images/upsum-logo-share-facebook-v2.png'
      }
    }
    
    return {
      id: query.id,
      question: question,
      relatedQuestions: relatedQuestions,
      session: session.getState(),
      shareUrl: shareUrl,
      shareImage: shareImageTwitter,
      shareImageTwitter: shareImageTwitter,
      shareImageFacebook: shareImageFacebook
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      relatedQuestions: props.relatedQuestions
    }
  }

  // This is called on initial page load
  async componentDidMount() {
    super.componentDidMount()
    
    this.setState({
      relatedQuestions: []
    })
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(this.props.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions
    })
  }
  
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps)
    
    this.setState({
      relatedQuestions: []
    })

    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions
    })
  }

  // Get related questions
  static async getRelatedQuestions(question) {
    if (!question['@id'])
      return

    const questions = new Questions

    let searchQuery = question.name
    searchQuery = searchQuery.replace(/(^who is |^what is |^why is |^who was |^what was |^who will |^what will |^why will |^who are |^what are |^why are |^who did |^why did |^what did |^how did |^how will|^how has |^how are )/gi, ' ')
    searchQuery = searchQuery.replace(/(^who |^what |^why |^how |^the )/gi, '')
    searchQuery = searchQuery.replace(/( the | to | and | is )/gi, ' ')

      
    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: 5, name: searchQuery, text: searchQuery  })
    
    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)
    })
    
    // If there are less than 5 questions in the related questions, add recent
    // questions to make up the difference in the list
    if (relatedQuestions.length < 5) {
      const recentQuestions = await questions.search({ limit: 10 })
      recentQuestions.forEach((recentQuestion, index) => {
        if (relatedQuestions.length >= 5 || question['@id'] == recentQuestion['@id']) {
          return
        } else {
          let existsInArray = false
          relatedQuestions.forEach((relatedQuestion, index) => {
            if (recentQuestion['@id'] == relatedQuestion['@id'])
              existsInArray = true
          })
          if (existsInArray === false) {
            relatedQuestions.push(recentQuestion)
          }
        }
      })
    }
    
    return relatedQuestions
  }
  
  popup(e) {
    window.open(e.target.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
    e.preventDefault()
    return false
  }
   
  render() {
    if (this.props.question['@id']) {
      
      let editButton
      if (this.props.session.sessionId) {
        editButton = <Link href={"/question/edit?id="+this.props.id} as={"/questions/edit/"+this.props.id}><a className="button"><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</a></Link>
      } else {
        editButton = <span/>
      }
      
      let imageTag
      /*
      if (this.props.question.image && this.props.question.image.url) {
        imageTag = 
          <div>
            <div className="question-image" style={{backgroundImage: 'url('+this.props.question.image.url+')'}}></div>
            <div className="question-image-text">
              <p>{this.props.question.image.caption}</p>
              <p className="muted"><i>Image Credit: {this.props.question.image.publisher.name}</i></p>
            </div>
          </div>
      }
      */

      let videoTag
      if (this.props.question.video && this.props.question.video.url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        /*
        var match = this.props.question.video.url.match(regExp)
        if (match && match[2].length == 11) {
          const videoEmbedUrl = "//www.youtube.com/embed/"+match[2]
          videoTag =
            <div className="question-video">
              <iframe width="100%" height="400" src={videoEmbedUrl} frameBorder="0" allowFullScreen></iframe>
            </div>
        }
        */
      }
      
      let answeredOn = <div><h4>This question has not been answered yet!</h4></div>
      if (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text)
        answeredOn =
          <div>
            <p className="date-label">
              <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={this.props.question.acceptedAnswer.datePublished || this.props.question['@dateModified']} />
            </p>
          </div>

      
      let citation
      if (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.citation)
        citation = 
          <div>
           <h5>Source(s)</h5>
            <div className="muted">
              <ReactMarkdown source={this.props.question.acceptedAnswer.citation}/>
           </div>
          </div>

      return (
        <Layout>
          <Head>
            <title>{this.props.question.name}</title>
            <meta property="og:title" content={this.props.question.name}/>
            <meta property="og:url" content={this.props.shareUrl}/>
            <meta property="og:description" content={(this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? removeMarkdown(this.props.question.acceptedAnswer.text) : ""}/>
            <meta property="og:image" content={this.props.shareImage}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content="upsumnews"/>
            <meta name="twitter:title" content={this.props.question.name}/>
            <meta name="twitter:description" content={(this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? removeMarkdown(this.props.question.acceptedAnswer.text) : "" }/>
            <meta name="twitter:image" content={this.props.shareImage}/>
          </Head>
          <div itemScope itemType="http://schema.org/Question">
            <div className="row">
              <div className="eight columns">
                <div className="question">
                  <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
                  <span itemProp="dateCreated" style={{display: "none"}}>{this.props.question['@dateCreated']}</span>
                  <span itemProp="dateModified" style={{display: "none"}}>{this.props.question['@dateModified']}</span>
                  {imageTag}
                  {videoTag}
                  <ReactMarkdown source={this.props.question.text || ''}/>
                  <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                  {answeredOn}
                    <div itemProp="text">
                      <ReactMarkdown source={(this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? this.props.question.acceptedAnswer.text : "" }/>
                    </div>
                  </div>
                  {citation}
                  <div className="buttons">
                    <a target="_blank" onClick={this.popup} className="button button-facebook" href={"http://www.facebook.com/sharer.php?u=" + this.props.shareUrl + "&t=" + this.props.question.name} title="Share on Facebook..."><i className="fa fa-fw fa-lg fa-facebook"/> Like</a>
                    <a target="_blank" onClick={this.popup} className="button button-twitter" href={"https://twitter.com/share?url=" + this.props.shareUrl + "&text=" + this.props.question.name}><i className="fa fa-fw fa-lg fa-twitter"/> Tweet</a>
                    {editButton}
                  </div>
                </div>
                <p className="muted" style={{fontSize: '15px'}}>
                  <i>You may use the text of this article under the terms of the Creative Commons <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> licence.</i>
                </p>
              </div>
              <div className="four columns">
                <div className="question-sidebar">
                {
                  this.state.relatedQuestions.map((question, i) => {
                    return <QuestionCard question={question} key={i}/>
                  })
                }
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )
    } else { 
      return (
        <Layout>
          <h4>{"Couldn't find the question you were looking for."}</h4>
        </Layout>
      )
    }
  }
}