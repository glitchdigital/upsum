import React from 'react'
import Page from '../layouts/main'
import Questions from '../models/questions'
import { Session } from '../models/session'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    const session = Session(req)
    const questions = new Questions
    const results = await questions.search({ limit: 25 })
    return { questions: results }
  }

  render() {
    return (
      <Page>
        <div className="row">
          <div className="eight columns">
          <h3>Questions</h3>
            {
              this.props.questions.map((question, i) => (
                <div key={i}>
                  <h4 style={{marginBottom: 0}}><a href={"/questions/"+question['@id'].split('/')[4]}>{question.name}</a></h4>
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