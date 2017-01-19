import Link from 'next/prefetch'
import React from 'react'
import MediaQuery from 'react-responsive'
import Layout from '../components/layout'
import Page from '../components/page'
import Questions from '../models/questions'
import { Session } from '../models/session'
import TimeAgo from 'react-timeago'

export default class extends Page {
  
  static async getInitialProps({ req }) {
    const session = Session(req)
    const questions = new Questions
    const results = await questions.search({ limit: 64 })
    return { questions: results }
  }

  renderQuestionCard(question, i) {
    let imageTag
    if (question.image && question.image.url) {
      imageTag = 
        <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>
          <div className="question-card-image" style={{backgroundImage: 'url('+question.image.url+')'}}></div>
        </Link>
    }
    return(
      <div className="question-card" key={i} onClick={ () => this.props.url.push("/question?id="+question['@id'].split('/')[4], "/questions/"+question['@id'].split('/')[4]) }>
        <h3 style={{marginBottom: '10px'}}><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>{question.name}</Link></h3>
        {imageTag}
        <p style={{marginBottom: '10px'}}><i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question['@dateModified']} /></p>
      </div>
    )
  }

  render() {
    // Split questions into seperate columns
    const numberOfColumns = 3
    const questions = []
    let currentList = 0
    this.props.questions.forEach((question) => {
      if (currentList == numberOfColumns) currentList = 0
      if (!questions[currentList]) questions[currentList] = []
      questions[currentList++].push(question)
    })
    
    return (
      <Layout>
        <div className="row">
          <div className="twelve columns">
            <h3><i className="fa fa-fw fa-line-chart"></i> Trending Questions</h3>
          </div>
        </div>
        <MediaQuery maxWidth={659}>
          <div className="row question-cards">
            <div className="columns twelve">
              {
                this.props.questions.map((question, i) => {
                  return this.renderQuestionCard(question, i)
                })
              }
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={660} values={{width: 660}}>
          <div className="row question-cards">
            <div className="columns four first">
              {
                questions[0].map((question, i) => {
                  return this.renderQuestionCard(question, i)
                })
              }
            </div>
            <div className="columns four">
              {
                questions[1].map((question, i) => {
                  return this.renderQuestionCard(question, i)
                })
              }
            </div>
            <div className="columns four last">
              {
                questions[2].map((question, i) => {
                  return this.renderQuestionCard(question, i)
                })
              }
            </div>
          </div>
        </MediaQuery>
      </Layout>
    )
  }
  
}