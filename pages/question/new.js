import React from 'react'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import Layout from '../../components/layout'
import Page from '../../components/page'
import QuestionForm from '../../components/question-form'

export default class extends Page {

  render() {
    const question = {
      name: '',
      text: '',
      acceptedAnswer: {
        name: '',
        text: ''
      },
      image: {
        publisher: {}
      },
      video: {
        publisher: {}
      }
    }
    return (
      <Layout>
        <div className="row">
          <div className="eight columns">
            <div className="question">
              <QuestionForm question={question}/>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
}