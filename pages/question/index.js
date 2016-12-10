import React from 'react'
import Link from 'next/link'
import Page from '../../layouts/main'
import Questions from '../../models/questions'
import { Session } from '../../models/session'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const question = await questions.get(query.id)
    return { question: question, session: session.getState() }
  }
   
  render() {
    if (this.props.question['@id']) {
      
      let editButton
      if (this.props.session.sessionId) {
        editButton = <a className="button" href={"/questions/edit/"+this.props.question['@id'].split('/')[4]}><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</a>
      } else {
        editButton = <span/>
      }

      return (
        <Page>
          <div itemScope itemType="http://schema.org/Question">
            <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
            <p itemProp="text"><i>{this.props.question.text}</i></p>
            <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
              <h5>Answer</h5>
              <p itemProp="text">{ (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? this.props.question.acceptedAnswer.text : "This question has not been answered yet!" }</p>
            </div>
            <p>{editButton}</p>
          </div>
        </Page>
      )
    } else { 
      return (
        <Page>
          <h4>{"Couldn't find the question you were looking for."}</h4>
        </Page>
      )
    }
  }
}