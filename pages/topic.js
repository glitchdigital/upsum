import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Questions from '../models/questions'
import { Session } from '../models/session'
import Layout from '../components/layout'
import Page from '../components/page'
import QuestionCard from '../components/question-card'
import Navbar from '../components/navbar'

export default class extends Page {

  static async getInitialProps({ req, query }) {
    await super.getInitialProps({req})
    const session = Session(req)
    const topic = query.topic || ''
    const questions = new Questions
    let results = await questions.search({ limit: 50, name: topic, text: topic })
    return { session: session.getState(), questions: results, topic: topic}
  }

  render() {
    return (
    <Layout>
      <Head>
        <title>Upsum Topic: {this.props.topic || 'Everything'}</title>
        <meta name="description" content={'Everything about ' + (this.props.topic || 'everything')}/>
      </Head>
      <Navbar breadcrumbs={[
        { name: 'Topic', href: '/topic' },
        { name: this.props.topic || 'Everything', href: '/topic/' + this.props.topic }
      ]}/>
      <div className="row">
          <div className="offset-by-one ten columns">
          {
            this.props.questions.map((question, i) => {
              return (
                <div key={`topic-${i}`} className="question">
                  <QuestionCard question={question} session={this.props.session} footer={(this.props.questions.length - i) + ' of ' + this.props.questions.length}/>
                </div>
              )
            })
          }
          <p style={{marginTop: '40px', textAlign: 'center'}}><Link href="/"><a>You&#39;re all caught up for now!</a></Link></p>
        </div>
      </div>
    </Layout>
    )
  }
  
}