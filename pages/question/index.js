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
    let props = await super.getInitialProps({req})
    const session = Session(req)
    const questions = new Questions
    
    // Get question
    const question = await questions.get(query.id)
    
    // When running on the server we get related questions in getInitialProps() 
    // When running in the browser we can fetch them after the page load in
    // componentDidMount() to improve page rendering time.
    let relatedQuestions = []
    if (typeof window === 'undefined' && question['@id']) {
      relatedQuestions = await this.getRelatedQuestions(question)
    }
    
    const trendingQuestions = await questions.getQuestionsFromUrl(props.baseUrl + '/trending-questions')

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

    props.id = query.id
    props.question = question
    props.relatedQuestions = relatedQuestions
    props.trendingQuestions = trendingQuestions
    props.shareUrl = shareUrl
    props.ampUrl = ampUrl
    props.shareUrl = shareUrl
    props.twitterImageUrl = twitterImageUrl
    props.facebookImageUrl = facebookImageUrl
    props.articleImageUrl = articleImageUrl
    
    return props
  }
  
  constructor(props) {
    super(props)
    this.state = {
      relatedQuestions: props.relatedQuestions,
      trendingQuestions: props.trendingQuestions
    }
  }

  // This is called on initial page load
  async componentDidMount() {
    super.componentDidMount()
    
    this.loadAd()
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(this.props.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions,
      trendingQuestions: this.state.trendingQuestions
    })
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
      trendingQuestions: this.state.trendingQuestions
    })
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)

    this.setState({
      relatedQuestions: relatedQuestions,
      trendingQuestions: nextProps.trendingQuestions
    })
  }

  // Get related questions
  static async getRelatedQuestions(question) {
    if (!question['@id'])
      return

    const questions = new Questions
    const maxQuestions = 20
      
    let searchQuery = question.name
    searchQuery = searchQuery.replace(/(^who is |^what is |^why is |^who was |^what was |^who will |^what will |^why will |^who are |^what are |^why are |^who did |^why did |^what did |^how did |^how will|^how has |^how are )/gi, ' ')
    searchQuery = searchQuery.replace(/(^who |^what |^why |^how |^the )/gi, '')
    searchQuery = searchQuery.replace(/( the | to | and | is )/gi, ' ')

    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: maxQuestions, name: searchQuery, text: searchQuery})

    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)
    })

    return relatedQuestions
  }

  loadAd() {
    new Promise((resolve) => {
      if (typeof window === 'undefined')
        return resolve(true)

      setTimeout(() => {

        /*
        window.medianet_cId = "8CUX3Y6BU"
        window.medianet_versionId = "111299"
        const isSSL = 'https:' == window.document.location.protocol
        const mnSrc = (isSSL ? 'https:' : 'http:') + '//contextual.media.net/nmedianet.js?cid=' + window.medianet_cId + (isSSL ? '&https=1' : '')

        let advertElementId = 'question-banner-advert-1'
        window.medianet_width = "728"
        window.medianet_height = "90"
        window.medianet_crid = "454917506"
        
        document.getElementById(advertElementId).innerHTML = '<div class="advertising-label">Advertising</div>'
        // Add advert
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
        */

        /*
        window.advert_sidebar_element_id = 'question-sidebar-advert-1'
        window.advert_sidebar_width = '300'
        window.advert_sidebar_height = '250'
        window.advert_sidebar_publisher_id = 'gillis49'

        window.advert_banner_element_id = 'question-banner-advert-1'
        window.advert_banner_width = '728'
        window.advert_banner_height = '90'
        window.advert_banner_publisher_id = 'gillis49'

        // Placeholders
        document.getElementById(window.advert_sidebar_element_id).innerHTML = '<div class="advertising-label">Advertising</div>'
        document.getElementById(window.advert_banner_element_id).innerHTML = '<div class="advertising-label">Advertising</div>'

        if (window.CHITIKA === undefined) { window.CHITIKA = { 'units' : [] } }
        window.CHITIKA.units.push({"calltype":"async[2]","publisher":window.advert_sidebar_publisher_id,"width":window.advert_sidebar_width,"height":window.advert_sidebar_height,"sid":"Chitika Default"})
        window.CHITIKA.units.push({"calltype":"async[2]","publisher":window.advert_sidebar_publisher_id,"width":window.advert_banner_width,"height":window.advert_banner_height,"sid":"Chitika Default"})

        // Insert advert
        postscribe('#'+advert_sidebar_element_id, '<div id="chitikaAdBlock-1"></div>', {
          done: () => {
            postscribe('#'+advert_banner_element_id, '<div id="chitikaAdBlock-2"></div>', {
              done: () => {
                // Insert advert loading script
                postscribe('#'+advert_sidebar_element_id, '<script src="//cdn.chitika.net/getads.js" async/>', {
                  done: () => {
                    resolve(true)
                  }
                })
              }
            })
          }
        })
      */
        window.advert_banner_element_id = 'question-banner-advert-2'
        document.getElementById(window.advert_banner_element_id).innerHTML = '<div class="advertising-label">Advertisement</div>'
        let scriptSrc = 'https://z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=893386b4-be01-4fa9-84a7-334f009437a4'
        postscribe('#'+advert_banner_element_id, '<script src="' + scriptSrc + '" async></script>', {
          done: () => {
            resolve(true)
          }
        })
      }, 1000)
        
    })

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
      
      let sidebarQuestions = []
      let followOnQuestions = []
      
      this.props.trendingQuestions.forEach((question,index) => {
        if (index < 12 && question['@id'] != this.props.question['@id'])
          sidebarQuestions.push(question)
      })
      
      this.state.relatedQuestions.forEach((question, index) => {
        // Add a couple of questions with images as "follow on" questions
        // (will add first two most 'relevant' cards with images)
        if ('image' in question &&
            'url' in question.image &&
            question.image.url != '' &&
            followOnQuestions.length < 2) {

          // @FIXME This is terrible, obviously
          let isInSidebar = false
          sidebarQuestions.forEach((sidebarQuestion,index) => {
            if (question['@id'] === sidebarQuestion['@id'])
              isInSidebar = true
          })
          if (isInSidebar === false)
            followOnQuestions.push(question)
        }
      })
      
      let articleImageHtml = ''
      if (this.props.articleImageUrl) {
        articleImageHtml = <span itemProp="image" itemScope itemType="https://schema.org/ImageObject">
          <img src={this.props.articleImageUrl} alt={description}/>
          <meta itemProp="url" content={this.props.shareUrl}/>
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
            <meta property="og:image" content={this.props.facebookImageUrl}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:site" content="upsumnews"/>
            <meta name="twitter:title" content={this.props.question.name}/>
            <meta name="twitter:description" content={description}/>
            <meta name="twitter:image" content={this.props.twitterImageUrl}/>
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
                <div id="question-banner-advert-1">
                  <div className="advertising-label">Advertisement</div>
                  <iframe src="https://rcm-na.amazon-adsystem.com/e/cm?o=1&p=48&l=ur1&category=amazonhomepage_2017&f=ifr&linkID=c09f3ae29dcf9acc6572ab37eebfe274&t=glitchdigital-20&tracking_id=glitchdigital-20" width="728" height="90" scrolling="no" marginWidth="0" style={{border:'none'}} frameBorder="0" className="hidden-mobile"/>
                  <iframe src="https://rcm-na.amazon-adsystem.com/e/cm?o=1&p=288&l=ur1&category=amazonhomepage_2017&f=ifr&linkID=091b6746cbcb31c247b2f96f46e35432&t=glitchdigital-20&tracking_id=glitchdigital-20" width="320" height="50" scrolling="no" marginWidth="0" style={{border:'none'}} frameBorder="0" className="hidden-desktop"/>
                </div>
                <div className="row follow-on-questions">
                  {
                    followOnQuestions.map((question, i) => {
                      return <div key={i} className="six columns"><QuestionCardPreview question={question}/></div>
                    })
                  }
                </div>
                <div id="question-banner-advert-2"></div>
              </div>
              <div className="four columns">
                <div className="question-sidebar">
                {
                  sidebarQuestions.map((question, i) => {
                    if (i > sidebarQuestions.length / 4)
                      return
                    return <div className="question-sidebar-item" key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
                  })
                }
                </div>
                <div id="question-sidebar-advert-1" className="hidden-mobile">
                  <div className="advertising-label">Advertisement</div>
                  <iframe src="https://rcm-na.amazon-adsystem.com/e/cm?o=1&p=12&l=ur1&category=audible&banner=1KNMQ6Z91A8KDJ552HG2&f=ifr&lc=pf4&linkID=be98b197c4f43d2a86ffbac3e5eea995&t=glitchdigital-20&tracking_id=glitchdigital-20" width="300" height="250" scrolling="no" marginWidth="0" style={{border:'none'}} frameBorder="0"/>
                </div>
                <div className="question-sidebar">
                {
                  sidebarQuestions.map((question, i) => {
                    if (i <= sidebarQuestions.length / 4)
                      return
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