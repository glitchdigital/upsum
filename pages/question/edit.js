import Link from 'next/prefetch'
import React from 'react'
import Textarea from 'react-textarea-autosize'
import Page from '../../layouts/main'
import Questions from '../../models/questions'
import { Session } from '../../models/session'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const question = await questions.get(query.id)
    
    if (!question['acceptedAnswer'])
      question['acceptedAnswer'] = { name: '', description: '' };
    
    return { question: question, session: session.getState() }
  }
   
  constructor(props) {
     super(props)
     this.state = this.props.question
     this.handleDelete = this.handleDelete.bind(this)
     this.handleChange = this.handleChange.bind(this)
     this.handleSubmit = this.handleSubmit.bind(this)
   }
   
  async handleDelete(event) {
    if (confirm('Are you sure you want delete this question?')) {
      const questionId = this.state['@id'].split('/')[4]
      const session = Session()
      const questions = new Questions
      const question = await questions.delete(questionId, session.getState().sessionId)
      window.location = "/"
    }
   }

  handleChange(event) {
    if (event.target.name == "question")
      this.state.name = event.target.value

    if (event.target.name == "questionDetail")
      this.state.text = event.target.value

      if (event.target.name == "image")
        this.state.image = event.target.value

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
    const question = await questions.update(this.state, session.getState().sessionId)
    
    // @FIXME Redirect to question view using window.location as hack…
    window.location = "/questions/"+this.state['@id'].split('/')[4];
    // … why does calling pushTo here result in an error?
    //this.props.url.pushTo("/questions/"+this.state['@id'].split('/')[4]);
  }
  
  render() {
    return (
      <Page>
        <div className="row">
          <div className="eight columns">
            <h2><i className="fa fa-fw fa-pencil"></i> Edit Question</h2>
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <h4>Question</h4>
              <label htmlFor="question">The question</label>
              <input name="question" className="u-full-width" type="text" placeholder="What is the question?" id="question" value={this.state.name}/>
              <label htmlFor="questionDetail">Additional detail to clarify the question (optional)</label>
              <Textarea name="questionDetail" className="u-full-width" placeholder="Optional detail to clarify the question." id="questionDetail" value={this.state.text}></Textarea>
              <label htmlFor="image"><i className="fa fa-fw fa-image"></i> Image URL (optional)</label>
              <input name="image" className="u-full-width" type="text" placeholder="" id="image" value={this.state.image}/>
              <h4>Answer</h4>
              {/*
              <label htmlFor="answerDetail">The answer to the question</label>
              <input name="answer" className="u-full-width" type="text" placeholder="The answer to the question." id="answer" value={this.state.acceptedAnswer.name}>/>
              */}
              <label htmlFor="answerDetail">The answer to the question</label>
              <Textarea name="answerDetail" className="u-full-width" placeholder="A detailed answer to the question." id="answerDetail" value={this.state.acceptedAnswer.text}></Textarea>
              <div className="u-cf u-full-width">
                <span className="u-pull-left"><span onClick={this.handleDelete} className="button"><i className="fa fa-fw fa-lg fa-trash"></i> Delete</span></span>
                <span className="u-pull-right">
                  <Link href={"/question?id="+this.state['@id'].split('/')[4]} as={"/questions/"+this.state['@id'].split('/')[4]}><span className="button">Cancel</span></Link>
                  &nbsp;
                  <button type="submit" className="button-primary">Save changes</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </Page>
    )
  }
}

