import React from 'react'
import Page from '../layouts/main'
import Questions from '../models/questions'

export default class extends React.Component {
  
  static async getInitialProps({ req }) {
    let questions = new Questions
    let results = await questions.search({ limit: 10 })
    return { questions: results }
  }

  render() {
    return (
      <Page>
        <div className="row">
          <div className="eight columns">
            {
              this.props.questions.map((question, i) => (
                <div key={i}>
                  <h4><a href={"/questions/"+question['@id'].split('/')[4]}>{question.name}</a></h4>
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