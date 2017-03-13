import Link from 'next/link'
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
        text: '',
        citation: '',
        datePublished: Date.now()
      },
      image: {
        publisher: {}
      },
      video: {
        publisher: {}
      },
    }
    return (
      <Layout>
        <div className="row">
          <div className="twelve columns">
            <div className="navbar">
              <Link href="/"><a className="unstyled"><i className="fa fa-fw fa-home"/> Home</a></Link>
              <i className="fa fa-fw fa-chevron-right seperator"/>
              <span>Questions</span>
              <i className="fa fa-fw fa-chevron-right seperator"/>
              <span>New</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="eight columns">
            <div className="question-card">
              <div className="question-card-contents">
                <QuestionForm question={question}/>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  
}