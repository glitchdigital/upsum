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
        {
          this.props.questions.map((question, i) => (
            <div key={i}>
              <h3>{question.name}</h3>
              <p>{question.text}</p>
            </div>
          ))
        }
      </Page>
    )
  }
  
}