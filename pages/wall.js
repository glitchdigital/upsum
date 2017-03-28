import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import Package from '../package.json'
import inlineCSS from '../css/main.scss'
import Questions from '../models/questions'
import Page from '../components/page'
import Navbar from '../components/navbar'
import QuestionCardPreview from '../components/question-card-preview'
import QuestionCard from '../components/question-card'

export default class extends Page {
  
  static async getInitialProps({ req }) {
    let props = await super.getInitialProps({req})
    const questions = new Questions
    props.questions= await questions.search({ limit: 50 })
    return props
  }

  constructor(props) {
    super(props)
    this.state = {
      questions: props.questions,
      question: null
    }
  }
  
  async componentDidMount() {
    super.componentDidMount()
    // Update with most recent questions on each page load
    const questions = new Questions
    const questionsResult = await questions.search({ limit: 50 })
    this.setState({
      questions: questionsResult,
      question: null
    })
  }
  
  openQuestion(question) {
    //window.open("/questions/"+questionId)
    //Router.push("/question?id="+questionId, "/questions/"+questionId)
    if (document.getElementById('question-container')) {
      document.getElementById('question-container').scrollTop = 0
      this.setState({
        questions: this.state.questions,
        question: null
      })
    } else {
      this.setState({
        questions: this.state.questions,
        question: question
      })
    }
  }
  
  render() {
    let stylesheet
    if (process.env.NODE_ENV === 'production') {
      // In production, serve pre-built CSS file from /assets/{version}/main.css
      let pathToCSS = '/assets/' + Package.version + '/main.css'
      stylesheet = <link rel="stylesheet" type="text/css" href={pathToCSS}/>
    } else {
      // In development, serve CSS inline (with live reloading) with webpack
      stylesheet = <style dangerouslySetInnerHTML={{__html: inlineCSS}}/>
    }
    
    let questionsWithThumbnails = []
    this.state.questions.map((question, i) => {
      if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
        let fileName = question.image.url.split('/').pop()
        let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_300,w_300,c_fill/'+fileName
        questionsWithThumbnails.push({question: question, questionId: question['@id'].split('/')[4], thumbnailUrl: imageUrl})
      }
    })
    
    let questionCard = ''
    if (this.state.question !== null) {
      questionCard = <div id="question-container" className="question-container">
        <QuestionCard question={this.state.question} session={this.props.session}/>
      </div>
    }
    
    return (
      <div>
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
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
          {stylesheet}
        </Head>
        <div className="image-wall-container">
          {questionCard}
          <div className="image-wall">
          {
            questionsWithThumbnails.map((item, i) => {
              return <div onClick={() => this.openQuestion(item.question)} className="image" key={i}>
                <h3>{item.question.name}</h3>
                <div className="img-wrapper"><img src={item.thumbnailUrl}/></div>
              </div>
            })
          }
          </div>
        </div>
      </div>
    )
  }

}