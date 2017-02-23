import Link from 'next/link'
import React from 'react'
import MediaQuery from 'react-responsive'
import Questions from '../models/questions'
import Layout from '../components/layout'
import Page from '../components/page'
import QuestionCard from '../components/question-card'
import AdSense from 'react-adsense'

export default class extends Page {
  
  static async getInitialProps({ req }) {
    await super.getInitialProps({req})
    const questions = new Questions
    const results = await questions.search({ limit: 64 })
    return { questions: results }
  }

  render() {
    // Split questions into seperate columns
    const numberOfColumns = 3
    const questions = []
    let currentList = 0
    this.props.questions.forEach((question) => {

      // Skip questions without answers
      //if (!question.acceptedAnswer || !question.acceptedAnswer.text)
      //  return
      
      if (currentList == numberOfColumns) currentList = 0
      if (!questions[currentList]) questions[currentList] = []
      questions[currentList++].push(question)
    })
    
    return (
      <Layout>
        <div>
          <div className="row">
            <div className="twelve columns">
              <h3><i className="fa fa-fw fa-line-chart"></i> Trending Questions</h3>
              <AdSense.Google client='ca-pub-8690794745241806' slot='0'/>
            </div>
          </div>
          <MediaQuery maxWidth={659}>
            <div className="row question-cards">
              <div className="columns twelve">
                {
                  this.props.questions.map((question, i) => {
                    return <QuestionCard question={question} key={i}/>
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
                    return <QuestionCard question={question} key={i}/>
                  })
                }
              </div>
              <div className="columns four">
                {
                  questions[1].map((question, i) => {
                    return <QuestionCard question={question} key={i}/>
                  })
                }
              </div>
              <div className="columns four last">
                {
                  questions[2].map((question, i) => {
                    return <QuestionCard question={question} key={i}/>
                  })
                }
              </div>
            </div>
          </MediaQuery>
        </div>
      </Layout>
    )
  }
  
}