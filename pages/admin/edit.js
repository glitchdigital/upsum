import React from 'react'
import Link from 'next/link'
import Page from '../../layouts/main'
import Questions from '../../models/questions'
import { Session } from '../../models/session'

export default class extends React.Component {

  getInitialProps({ req }) {
    const session = Session(req)
  }

  constructor(props) {
     super(props)
     this.state = {
       name: '',
       text: '',
       acceptedAnswer: {
         name: '',
         text: ''
       }
     }
     this.handleChange = this.handleChange.bind(this)
     this.handleSubmit = this.handleSubmit.bind(this)
   }
  
  handleChange(event) {
    if (event.target.name == "question")
      this.state.name = event.target.value

    if (event.target.name == "questionDetail")
      this.state.text = event.target.value

    if (event.target.name == "answer")
      this.state.acceptedAnswer.name = event.target.value

    if (event.target.name == "answerDetail")
      this.state.acceptedAnswer.text = event.target.value

    this.setState(this.state)
  }

  async handleSubmit(event) {
    event.preventDefault()
    const session = Session()
    const questions = new Questions
    const question = await questions.create(this.state, session.getState().sessionId)
    
    // Redirect to question view
    this.props.url.pushTo("/questions/"+question['@id'].split('/')[4]);
  }
  
  render() {
    return (
      <Page>
        <div className="row">
          <div className="nine columns">
            <h2><i className="fa fa-fw fa-pencil"></i> Edit Question</h2>
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <h4>Question</h4>
              <label htmlFor="question">The question</label>
              <input name="question" className="u-full-width" type="text" placeholder="What is the question?" id="question" />
              <label htmlFor="questionDetail">Additional detail to clarify the question (optional)</label>
              <textarea name="questionDetail" className="u-full-width" placeholder="Optional detail to clarify the question." id="questionDetail"></textarea>
              <h4>Answer</h4>
              {/*
              <label htmlFor="answerDetail">The answer to the question</label>
              <input name="answer" className="u-full-width" type="text" placeholder="The answer to the question." id="answer" />
              */}
              <label htmlFor="answerDetail">The answer to the question</label>
              <textarea name="answerDetail" className="u-full-width" placeholder="A detailed answer to the question," id="answerDetail"></textarea>
              <p className="u-pull-right">
                <Link href="/admin"><span className="button">Cancel</span></Link>
                &nbsp;
                <button type="submit" className="button-primary ">Save Changes</button>
              </p>
            </form>
          </div>
        </div>
      </Page>
    )
  }
  
}