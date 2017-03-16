import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'
import removeMarkdown from 'remove-markdown'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import Layout from '../../components/layout'
import Page from '../../components/page'
import QuestionCardPreview from '../../components/question-card-preview'
import QuestionCard from '../../components/question-card'

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
    
    this.loadAd()
  }
    
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id)
      return
      
    super.componentWillReceiveProps(nextProps)
    
    this.setState({
      relatedQuestions: []
    })

    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions
    })

    this.loadAd()
  }

  // Get related questions
  static async getRelatedQuestions(question) {
    if (!question['@id'])
      return

    const questions = new Questions
    const maxQuestions = 10
      
    let searchQuery = question.name
    searchQuery = searchQuery.replace(/(^who is |^what is |^why is |^who was |^what was |^who will |^what will |^why will |^who are |^what are |^why are |^who did |^why did |^what did |^how did |^how will|^how has |^how are )/gi, ' ')
    searchQuery = searchQuery.replace(/(^who |^what |^why |^how |^the )/gi, '')
    searchQuery = searchQuery.replace(/( the | to | and | is )/gi, ' ')

      
    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: maxQuestions, name: searchQuery, text: searchQuery  })
    
    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)
    })
    
    // If there are less than 5 questions in the related questions, add recent
    // questions to make up the difference in the list
    if (relatedQuestions.length < maxQuestions) {
      const recentQuestions = await questions.search({ limit: 20 })
      recentQuestions.forEach((recentQuestion, index) => {
        if (relatedQuestions.length >= maxQuestions || question['@id'] == recentQuestion['@id']) {
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

  loadAd() {
    /*
    new Promise((resolve) => {
      if (typeof window === 'undefined')
        return resolve(true)

      setTimeout(() => {
        window.medianet_cId = "8CUX3Y6BU"
        window.medianet_versionId = "111299"
        const isSSL = 'https:' == window.document.location.protocol
        const mnSrc = (isSSL ? 'https:' : 'http:') + '//contextual.media.net/nmedianet.js?cid=' + window.medianet_cId + (isSSL ? '&https=1' : '')

        let advertElementId = 'question-card-advert-1'
        window.medianet_width = "728"
        window.medianet_height = "90"
        window.medianet_crid = "454917506"
        
        document.getElementById(advertElementId).innerHTML = '<div class="advertising-label">Advertising</div>'
        // Add new adverts
        postscribe('#'+advertElementId, '<script src="' + mnSrc + '"></script>', {
          done: () => {
            let advertElementId = 'question-sidebar-advert-1'
            
            window.medianet_width = "336"
            window.medianet_height = "280"
            window.medianet_crid = "314290551"
            
            document.getElementById(advertElementId).innerHTML = '<div class="advertising-label">Advertising</div>'
            postscribe('#'+advertElementId, '<script src="' + mnSrc + '"></script>', {
              done: () => {
                resolve(true)
              }
            })
          }
        })
    
      }, 500)
    })
    */
   }
  
  render() {
    if (this.props.question['@id']) {

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
      
      let sidebarRelatedQuestions = this.state.relatedQuestions
      let followOnRelatedQuestions = []
      
      sidebarRelatedQuestions.forEach((question, index) => {
        if (followOnRelatedQuestions.length >= 2)
          return

        if ('image' in question &&
            'url' in question.image &&
            question.image.url != '') {
            followOnRelatedQuestions.push(question)
            sidebarRelatedQuestions.splice(index, 1)
        }
      })

      return (
        <Layout>
          <Head>
            <title>{this.props.question.name}</title>
            <meta name="description" content={description}/>
            <meta property="og:title" content={this.props.question.name}/>
            <meta property="og:url" content={this.props.shareUrl}/>
            <meta property="og:description" content={description}/>
            <meta property="og:image" content={this.props.shareImage}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content="upsumnews"/>
            <meta name="twitter:title" content={this.props.question.name}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={this.props.shareImage}/>
          </Head>
          <div>
            <div className="row">
              <div className="twelve columns">
                <div className="navbar">
                  <Link href="/"><a className="unstyled"><i className="fa fa-fw fa-home"/> Home</a></Link>
                  <i className="fa fa-fw fa-chevron-right seperator"/>
                  <Link href="/questions"><a className="unstyled">Questions</a></Link>
                  <i className="fa fa-fw fa-chevron-right seperator"/>
                  <span>{this.props.question.name}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="eight columns">
                <QuestionCard question={this.props.question} session={this.props.session}/>
                <div className="row">
                  {
                    followOnRelatedQuestions.map((question, i) => {
                      return <div key={i} className="six columns"><QuestionCardPreview question={question}/></div>
                    })
                  }
                </div>
              </div>
              <div className="four columns">
                {/*<div id="question-sidebar-advert-1"></div>*/}
                <div className="question-sidebar">
                {
                  sidebarRelatedQuestions.map((question, i) => {
                    return <div key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
                  })
                }
                </div>
              </div>
            </div>
          </div>
          <div style={{display: 'none'}}>
            <div itemScope itemType="http://schema.org/NewsArticle">
              <span itemProp="headline">{this.props.question.name}</span><br/>
              <link itemProp="mainEntityOfPage" href={this.props.shareUrl}/><br/>
              <span itemProp="url">{this.props.shareUrl}</span><br/>
              <span itemProp="datePublished">{datePublished}</span><br/>
              <span itemProp="dateCreated">{this.props.question['@dateCreated']}</span><br/>
              <span itemProp="dateModified">{this.props.question['@dateModified']}</span><br/>
              <span itemProp="author" itemScope itemType="https://schema.org/Organization"><br/>
                <span itemProp="name">Upsum</span><br/>
              </span>
              <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                <span itemProp="name">Upsum</span><br/>
                <span itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
                  <meta itemProp="url" content={this.props.shareImage}/><br/>
                  <meta itemProp="height" content="537"/>
                  <meta itemProp="width" content="537"/>
                </span>
              </span>
              <span itemProp="image" itemScope itemType="https://schema.org/ImageObject">
                <img src={this.props.shareImage}/><br/>
                <meta itemProp="url" content={this.props.shareImage}/><br/>
                <meta itemProp="height" content="537"/>
                <meta itemProp="width" content="537"/>
              </span>
              <span itemProp="articleBody"><ReactMarkdown source={fullText}/></span>
            </div>
          </div>
        </Layout>
      )
    } else { 
      return (
        <Layout>
          <h4>{"Unable to find the question you were looking for."}</h4>
        </Layout>
      )
    }
  }
}