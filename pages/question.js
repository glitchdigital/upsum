import React from 'react'
import Page from '../layouts/main'
import Questions from '../models/questions'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    // @TODO Fetch question based on query string
    let questions = new Questions
    let question = await questions.get(query.id)
    return { question: question }
  }
   
  render() {
    if (this.props.question['@id']) {
    return (
      <Page>
        <h2>{this.props.question.name}</h2>
        <p><i>{this.props.question.text}</i></p>
        <h5>Answer</h5>
        <p>{ (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? this.props.question.acceptedAnswer.text : "This question has not been answered yet!" }</p>
        {/*
        <p><a href="#" className="button">Edit</a></p>
        */}
      </Page>
    )
    } else { 
      return (
        <Page>
          <h3>{"I can't find the question you were looking for"}</h3>
          <p>What did you want to know?</p>
        </Page>
      )
    }
  }
}