import Link from 'next/link'
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
          <div className="twelve columns">
            <div className="navbar">
              <Link href="/"><a className="unstyled"><i className="fa fa-fw fa-home"/> Home</a></Link>
              <i className="fa fa-fw fa-chevron-right seperator"/>
              <Link href="/" as="/questions"><a className="unstyled">Questions</a></Link>
              <i className="fa fa-fw fa-chevron-right seperator"/>
              <span>Edit</span>
            </div>
          </div>
        </div>
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

