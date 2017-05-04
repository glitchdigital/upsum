import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Questions from '../models/questions'
import { Session } from '../models/session'
import Layout from '../components/layout'
import Page from '../components/page'
import QuestionCardPreview from '../components/question-card-preview'
import Navbar from '../components/navbar'

export default class extends Page {

  static async getInitialProps({ req, query }) {
    await super.getInitialProps({req})
    const session = Session(req)

    let searchQuery = query.q || ''
    searchQuery = searchQuery.replace(/(^who is |^what is |^why is |^who was |^what was |^who will |^what will |^why will |^who are |^what are |^why are |^who did |^why did |^what did |^how did |^how will|^how has |^how are )/gi, ' ')
    searchQuery = searchQuery.replace(/(^who |^what |^why |^how |^the )/gi, '')
    searchQuery = searchQuery.replace(/( the | to | and | is )/gi, ' ')
    
    const questions = new Questions
    let results = await questions.search({ limit: 50, name: searchQuery, text: searchQuery })
    return { session: session.getState(), questions: results, query: query.q || '', searchQuery: searchQuery}
  }

  render() {
    // Split questions into seperate columns
    const numberOfColumns = 3
    const questions = []
    for (let column = 0; column < numberOfColumns;  column++) {
      questions[column] = []
    }
    let currentList = 0
    this.props.questions.forEach((question) => {
      if (currentList == numberOfColumns) currentList = 0
      questions[currentList++].push(question)
    })
  
    let query = <h3 style={{marginTop: '10px'}}>Try asking us a question about something in the news</h3>
    if (this.props.query !== '') {
      query = <h3 style={{marginTop: '10px'}}><i className="fa fa-search"></i> <i>"{this.props.query}"</i></h3>
    }
    
    let message
    if (this.props.questions.length === 0) {
      message = <p style={{textAlign: 'center'}}><i>Sorry, we don&#39;t have any answers about that.</i></p>
    }

    return (
      <Layout>
        <Head>
          <title>Upsum - Search for {this.props.query}</title>
          <meta name="description" content="Search Upsum for answers to your questions about the news."/>
        </Head>
        <Navbar breadcrumbs={[
          { name: 'Search', href: '/search' }
        ]}/>
        <div className="row">
          <div className="twelve columns">
            {query}
            {message}
          </div>
        </div>
        <div className="hidden-desktop">
          <div className="row question-cards">
            <div className="columns twelve">
              {
                this.props.questions.map((question, i) => {
                  return <div key={i}><QuestionCardPreview question={question} className="question-card-preview-small"/></div>
                })
              }
            </div>
          </div>
        </div>
        <div className="hidden-mobile">
          <div className="row question-cards">
            <div className="columns four first">
              {
                questions[0].map((question, i) => {
                  return <div key={i}><QuestionCardPreview question={question}/></div>
                })
              }
            </div>
            <div className="columns four">
              {
                questions[1].map((question, i) => {
                  return <div key={i}><QuestionCardPreview question={question}/></div>
                })
              }
            </div>
            <div className="columns four last">
              {
                questions[2].map((question, i) => {
                  return <div key={i}><QuestionCardPreview question={question}/></div>
                })
              }
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
}