import React from 'react'
import Page from '../layouts/main'
import Questions from '../lib/questions'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    let questions = new Questions
    let results = await questions.search({ limit: 10, slug: query.q })
    return { questions: results }
  }
   
  render() {
    return (
      <Page>
        <h3>… insert question here … </h3>
        <p><i>… insert answer here …</i></p>
      </Page>
    )
  }
}