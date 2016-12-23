import Link from 'next/prefetch'
import React from 'react'
import Page from '../layouts/main'
import Questions from '../models/questions'
import { Session } from '../models/session'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const results = await questions.search({ limit: 25, name: query.q })
    return { questions: results, query: query.q }
  }

  render() {
    return (
      <Page>
        <div className="row">
          <div className="twelve columns">
          <h3><i className="fa fa-search"></i> <i>"{this.props.query}"</i></h3>
            {
              this.props.questions.map((question, i) => (
                <div key={i}>
                  <h4 style={{marginBottom: 0}}><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>{question.name}</Link></h4>
                  <p>Answered <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question['@dateModified']} /></p>
                </div>
              ))
            }
          </div>
          <div className="four columns">
            {/*
            <h5>POPULAR</h5>
            <p>…</p>
            <h5>NEW</h5>
            <p>…</p>
          */}
          </div>
        </div>
      </Page>
    )
  }
  
}