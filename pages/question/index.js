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
    let shareUrl = 'https://upsum.news/questions/' + query.id
    let shareImageTwitter = 'https://upsum.news/static/images/upsum-logo-share-twitter.png'
    let shareImageFacebook = 'https://upsum.news/static/images/upsum-logo-share-facebook-v2.png'

    if ('image' in question &&
        'url' in question.image &&
        question.image.url != '') {
      let fileName = question.image.url.split('/').pop()
      shareImageTwitter = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
      shareImageFacebook = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,w_1200,c_fill/'+fileName
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
      if (this.props.question.image && this.props.question.image.url) {
        let fileName = this.props.question.image.url.split('/').pop()
        let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
        imageTag = 
          <div>
            <div className="question-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div>
            <div className="question-image-text">
              <p className="image-caption">{this.props.question.image.caption}</p>
              <p className="image-credit">Image credit: <a target="_blank" href={this.props.question.image.publisher.url || 'https://upsum.news'}>{this.props.question.image.publisher.name || 'Upsum'}</a></p>
            </div>
          </div>
      }

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

      let datePublished = this.props.question['@dateCreated']
      if ('acceptedAnswer' in this.props.question
          && 'text' in this.props.question.acceptedAnswer
          && this.props.question.acceptedAnswer.datePublished !== '') {
        datePublished = this.props.question.acceptedAnswer.datePublished
      }

      let description = 'Upsum - Find answers to questions about the news'
      if ('text' in this.props.question && this.props.question.text != '') {
        description = removeMarkdown(this.props.question.text)
      } else if ('acceptedAnswer' in this.props.question
                  && 'text' in this.props.question.acceptedAnswer
                  && this.props.question.acceptedAnswer.text !== '') {
        description = removeMarkdown(this.props.question.acceptedAnswer.text)
      }
      
      let fullText = ''
      if ('text' in this.props.question && this.props.question.text !== '') {
        fullText += this.props.question.text+"\n\n"
      }
      if ('acceptedAnswer' in this.props.question
          && 'text' in this.props.question.acceptedAnswer
          && this.props.question.acceptedAnswer.text !== '') {
        fullText += this.props.question.acceptedAnswer.text
      }

      return (
        <Layout>
          <Head>
            <title>{this.props.question.name}</title>
            <meta name="description" content={description}/>
            <meta property="og:title" content={this.props.question.name}/>
            <meta property="og:url" content={this.props.shareUrl}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={this.props.shareImage}/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:site" content="upsumnews"/>
            <meta name="twitter:title" content={this.props.question.name}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={this.props.shareImage}/>
          </Head>
          <div>
            <div>
              <div className="row">
                <div className="eight columns">
                  <div className="question">
                    <div itemScope itemType="http://schema.org/Question">
                      <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
                      <span itemProp="url" style={{display: 'none'}}>{this.props.shareUrl}</span>
                      <span itemProp="datePublished" style={{display: 'none'}}>{datePublished}</span>
                      <span itemProp="dateCreated" style={{display: 'none'}}>{this.props.question['@dateCreated']}</span>
                      <span itemProp="dateModified" style={{display: 'none'}}>{this.props.question['@dateModified']}</span>
                      {imageTag}
                      {videoTag}
                      <div style={{fontStyle: 'oblique'}}>
                        <ReactMarkdown source={this.props.question.text || ''}/>
                      </div>
                      <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                      {answeredOn}
                        <div itemProp="text">
                          <ReactMarkdown source={(this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? this.props.question.acceptedAnswer.text : "" }/>
                        </div>
                      </div>
                      {citation}
                    </div>
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
            <div style={{display: 'none'}}>
              <div itemScope itemType="http://schema.org/NewsArticle">
                <span itemProp="headline">{this.props.question.name}</span>
                <link itemProp="mainEntityOfPage" href={this.props.shareUrl}/>
                <span itemProp="url">{this.props.shareUrl}</span>
                <span itemProp="datePublished">{datePublished}</span>
                <span itemProp="dateCreated">{this.props.question['@dateCreated']}</span>
                <span itemProp="dateModified">{this.props.question['@dateModified']}</span>
                <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Upsum</span>
                </span>
                <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                  <span itemProp="name">Upsum</span>
                  <span itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
                    <meta itemProp="url" content={this.props.shareImage}/>
                    <meta itemProp="height" content="537"/>
                    <meta itemProp="width" content="537"/>
                  </span>
                </span>
                <span itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                  <img src="{this.props.shareImage}"/>
                  <meta itemProp="url" content={this.props.shareImage}/>
                  <meta itemProp="height" content="537"/>
                  <meta itemProp="width" content="537"/>
                </span>
                <span itemProp="articleBody"><ReactMarkdown source={fullText}/></span>
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