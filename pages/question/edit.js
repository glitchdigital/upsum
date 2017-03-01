import React from 'react'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import Layout from '../../components/layout'
import Page from '../../components/page'
import QuestionForm from '../../components/question-form'

export default class extends Page {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const question = await questions.get(query.id)
    return { question: question, session: session.getState() }
  }
  
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="eight columns">
            <div className="question-card">
              <div className="question-card-contents">
                <QuestionForm question={this.props.question}/>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

