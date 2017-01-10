import Link from 'next/prefetch'
import React from 'react'
import Page from '../layouts/main'
import Questions from '../models/questions'
import { Session } from '../models/session'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    const session = Session(req)
    const questions = new Questions
    const results = await questions.search({ limit: 24 })
    return { questions: results }
  }

  renderQuestionCard(question, i) {
    
    let imageTag
    if (question.image) {
      imageTag = 
        <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>
          <div className="question-card-image" style={{backgroundImage: 'url('+question.image+')'}}></div>
        </Link>
    }
    return(
      <div className="question-card" key={i}>
        <h3 style={{marginBottom: '10px'}}><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>{question.name}</Link></h3>
        {imageTag}
        <p style={{marginBottom: '10px'}}>Answered <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question['@dateModified']} /></p>
      </div>
    )
  }
  
  render() {
    // Split questions into seperate lists (with n per list )
    const numberOfLists = 3
    const questions = [...this.props.questions]
    const questionsPerList = questions.length / numberOfLists
    const questionsAsLists = []
    while (questions.length > 0) {
      questionsAsLists.push(questions.splice(0, numberOfLists))
    }
    
    return (
      <Page>
        <div className="row">
          <div className="twelve columns">
            <h3><i className="fa fa-fw fa-line-chart"></i> Trending Questions</h3>
          </div>
        </div>
        <div className="row">
          <div className="four columns">
            {
              questionsAsLists[0].map((question, i) => {
                return this.renderQuestionCard(question, i)
              })
            }
          </div>
          <div className="four columns">
            {
              questionsAsLists[1].map((question, i) => {
                return this.renderQuestionCard(question, i)
              })
            }
          </div>
          <div className="four columns">
            {
              questionsAsLists[2].map((question, i) => {
                return this.renderQuestionCard(question, i)
              })
            }
          </div>
        </div>
      </Page>
    )
  }
  
}