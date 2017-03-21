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
import Navbar from '../../components/navbar'
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
    let ampUrl = 'https://upsum.news/amp/questions/' + query.id
    let twitterImageUrl = 'https://upsum.news/static/images/upsum-logo-share-twitter.png'
    let facebookImageUrl = 'https://upsum.news/static/images/upsum-logo-share-facebook-v2.png'
    let articleImageUrl
    
    if ('image' in question &&
        'url' in question.image &&
        question.image.url != '') {
      let fileName = question.image.url.split('/').pop()
      twitterImageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
      facebookImageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,w_1200,c_fill/'+fileName
      articleImageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
    }

    console.log('getInitialProps')
    return {
      id: query.id,
      question: question,
      relatedQuestions: relatedQuestions,
      session: session.getState(),
      shareUrl: shareUrl,
      ampUrl: ampUrl,
      shareImage: twitterImageUrl,
      twitterImageUrl: twitterImageUrl,
      facebookImageUrl: facebookImageUrl,
      articleImageUrl: articleImageUrl
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      relatedQuestions: props.relatedQuestions,
      relatedQuestionsLoading: false
    }
  }

  // This is called on initial page load
  async componentDidMount() {
    super.componentDidMount()
    
    this.loadAd()
    
    this.setState({
      relatedQuestions: this.state.relatedQuestions,
      relatedQuestionsLoading: true
    })
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(this.props.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions,
      relatedQuestionsLoading: false
    })
    console.log('componentDidMount')
  }
    
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id)
      return
      
    super.componentWillReceiveProps(nextProps)

    this.loadAd()

    this.setState({
      relatedQuestions: this.state.relatedQuestions,
      relatedQuestionsLoading: true
    })
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)

    this.setState({
      relatedQuestions: [],
      relatedQuestionsLoading: true
    })

    this.setState({
      relatedQuestions: relatedQuestions,
      relatedQuestionsLoading: false
    })

    console.log('componentWillReceiveProps')
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

    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)
    })

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

      let datePublished = this.props.question['@dateModified']
      if ('acceptedAnswer' in this.props.question
          && 'datePublished' in this.props.question.acceptedAnswer
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
      
      let sidebarRelatedQuestions = []
      let followOnRelatedQuestions = []
      
      this.state.relatedQuestions.forEach((question, index) => {

        // Add a couple of questions with images as "follow on" questions
        // (will add first two most 'relevant' cards with images)
        if ('image' in question &&
            'url' in question.image &&
            question.image.url != '' &&
            followOnRelatedQuestions.length < 2) {
            // Only two follow on questions for now (rest go in sidebar)
          followOnRelatedQuestions.push(question)
        } else {
          sidebarRelatedQuestions.push(question)
        }
      })
      
      let articleImageHtml = ''
      if (this.props.articleImageUrl) {
        articleImageHtml = <span itemProp="image" itemScope itemType="https://schema.org/ImageObject">
          <img src={this.props.articleImageUrl} alt={description}/>
          <meta itemProp="url" content={this.props.shareImage}/>
          <meta itemProp="height" content="512"/>
          <meta itemProp="width" content="1024"/>
        </span>
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
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content="upsumnews"/>
            <meta name="twitter:title" content={this.props.question.name}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={this.props.shareImage}/>
            <link rel="amphtml" href={this.props.ampUrl}/> 
            <link rel="canonical" href={this.props.shareUrl}/>
          </Head>
          <div>
            <Navbar breadcrumbs={[
              { name: 'Questions', href: '/' }
            ]}/>
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
                <div className={(this.state.relatedQuestionsLoading) ? 'question-sidebar loading' : 'question-sidebar'}>
                {
                  sidebarRelatedQuestions.map((question, i) => {
                    return <div className="question-sidebar-item" key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
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
                  <meta itemProp="url" content="https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_512,c_fill/upsum-publisher-logo_e6x61w.png"/><br/>
                  <meta itemProp="height" content="512"/>
                  <meta itemProp="width" content="512"/>
                </span>
              </span>
              {articleImageHtml}
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