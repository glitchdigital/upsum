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
    
    if (!window.googleadsenseloaded) {
      window.googleadsenseloaded = true
      if (!adsbygoogle) var adsbygoogle
      (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-8690794745241806",
        enable_page_level_ads: false
      })
    }
  }
    
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    if (nextProps.id === this.props.id)
      return
      
    super.componentWillReceiveProps(nextProps)

    this.setState({
      relatedQuestions: this.state.relatedQuestions,
      trendingQuestions: this.state.trendingQuestions
    })
    
    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)

    this.setState({
      relatedQuestions: relatedQuestions,
      trendingQuestions: nextProps.trendingQuestions
    })
    
    this.loadAd()
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
    new Promise((resolve, reject) => {
      if (typeof window === 'undefined')
        return resolve(true)
        
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.length = 0

      // Reset ad on page
      document.getElementById('ad-slot-0').innerHTML = ''
      postscribe('#ad-slot-0', 
        '<ins class="adsbygoogle"'+
        ' style="display: block; width: 728px; height: 90px;"'+
        ' data-ad-client="ca-pub-8690794745241806"'+
        ' data-ad-slot="1971760377"'+
        ' data-ad-format=""/>',
        {
          done: () => {
              // Render ad
              (adsbygoogle || window.adsbygoogle).push({})
              
              // Reset ad on page
              document.getElementById('ad-slot-1').innerHTML = ''
              postscribe('#ad-slot-1', 
                '<ins class="adsbygoogle"'+
                ' style="display: block; width: 336px; height: 280px;"'+
                ' data-ad-client="ca-pub-8690794745241806"'+
                ' data-ad-slot="2111361179"'+
                ' data-ad-format=""/>',
                {
                  done: () => {
                    // Render ad
                    (adsbygoogle || window.adsbygoogle).push({})
                    resolve(true)
                  }
              })
          }
      })
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
        if (index <= 8 && question['@id'] != this.props.question['@id'])
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

      let newsArticle = {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": this.props.question.name,
        "mainEntityOfPage": this.props.shareUrl,
        "datePublished": datePublished,
        "dateCreated": this.props.question['@dateCreated'],
        "dateModified": this.props.question['@dateModified'],
        "articleBody": removeMarkdown(fullText),
        "author": {
          "@type":  "Organization",
          "name": "Upsum News"
        },
        "publisher": {
          "@type":  "Organization",
          "name": "Upsum News",
          "logo": {
            "@type":  "ImageObject",
            "url": "https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_512,c_fill/upsum-publisher-logo_e6x61w.png",
            "height": "512",
            "width": "512"
          }
        }
      }

      if (this.props.articleImageUrl) {
        newsArticle.image = {
          "@type":  "ImageObject",
          "url": this.props.articleImageUrl,
          "height": "512",
          "width": "512"
        }
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
            <script src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async/>
          </Head>
          <div id="ad-script"></div>
          <div>
            <Navbar breadcrumbs={[
              { name: 'Questions', href: '/' }
            ]}/>
            <div className="row">
              <div className="eight columns">
                <QuestionCard question={this.props.question} session={this.props.session}/>
                <div id="ad-slot-0" style={{width: '728px', height: '90px'}}></div>
                <div className="row follow-on-questions">
                  {
                    followOnQuestions.map((question, i) => {
                      return <div key={i} className="six columns"><QuestionCardPreview question={question}/></div>
                    })
                  }
                </div>
              </div>
              <div className="four columns">
                <div className="question-sidebar">
                {
                  sidebarQuestions.map((question, i) => {
                    if (i > 3)
                      return
                    return <div className="question-sidebar-item" key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
                  })
                }
                <div id="ad-slot-1" style={{width: '336px', height: '280px'}}></div>
                {
                  sidebarQuestions.map((question, i) => {
                    if (i <= 3)
                      return
                    return <div className="question-sidebar-item" key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
                  })
                }
                </div>
              </div>
            </div>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:  JSON.stringify(newsArticle) }}/>
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