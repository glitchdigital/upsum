import Router from 'next/router'
import Link from 'next/prefetch'
import React from 'react'
import TimeAgo from 'react-timeago'
import Textarea from 'react-textarea-autosize'
import Questions from '../models/questions'
import { Session } from '../models/session'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      question: this.props.question
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
   
  async handleDelete(event) {
    if (confirm('Are you sure you want delete this question?')) {
      const questionId = this.state.question['@id'].split('/')[4]
      const session = Session()
      const questions = new Questions
      const question = await questions.delete(questionId, session.getState().sessionId)
      Router.push("/")
    }
   }

  handleChange(event) {
    if (event.target.name == "question")
      this.state.question.name = event.target.value

    if (event.target.name == "questionDetail")
      this.state.question.text = event.target.value

    if (event.target.name == "imageUrl")
      this.state.question.image.url = event.target.value
      
    if (event.target.name == "imageCaption")
      this.state.question.image.caption = event.target.value
      
    if (event.target.name == "imagePublisher")
      this.state.question.image.publisher.name = event.target.value

    if (event.target.name == "videoUrl")
      this.state.question.video.url = event.target.value
    
    if (event.target.name == "videoCaption")
      this.state.question.video.caption = event.target.value
    
    if (event.target.name == "videoPublisher")
      this.state.question.video.publisher.name = event.target.value
      
    if (event.target.name == "answer")
      this.state.question.acceptedAnswer.name = event.target.value

    if (event.target.name == "answerDetail")
      this.state.question.acceptedAnswer.text = event.target.value

    this.setState(this.state.question)
  }

  async handleSubmit(event) {
    event.preventDefault()
    const session = Session()
    const questions = new Questions
    let question = {}
    if (this.state.question['@id']) {
      // If we have an ID, update the Question
      question = await questions.update(this.state.question, session.getState().sessionId)
    } else {
      // If we dont have an ID, create a Question
      question = await questions.create(this.state.question, session.getState().sessionId)
    }
    // Redirect to read only view
    const questionId = question['@id'].split('/')[4]
    Router.push("/question?id="+questionId, "/questions/"+questionId)
  }
    
  render() {
    const questionId = this.state.question['@id'] ? this.state.question['@id'].split('/')[4] : null
    let deleteButton
    if (questionId)
      deleteButton = <span className="u-pull-left"><span onClick={this.handleDelete} className="button"><i className="fa fa-fw fa-lg fa-trash"></i> Delete</span></span>
    
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <h4>Question</h4>
        <label htmlFor="question">The question</label>
        <input name="question" className="u-full-width" type="text" placeholder="What is the question?" id="question" value={this.state.question.name}/>
        <label htmlFor="questionDetail">Optional detail to clarify the question</label>
        <Textarea name="questionDetail" className="u-full-width" placeholder="Optional detail to clarify the question." id="questionDetail" value={this.state.question.text}></Textarea>
        {/*
        <p className="buttons">
          <button type="button"><i className="fa fa-lg fa-fw fa-image"></i> Add image…</button>
          <button type="button"><i className="fa fa-lg fa-fw fa-play"></i> Add video…</button>
          <button type="button"><i className="fa fa-lg fa-fw fa-volume-up"></i> Add audio…</button>
        </p>
        */}
        <div style={{display: "none"}}>
          <div className="box">
            <div className="u-pull-right">
              <i className={this.state.question.image.url ? "fa fa-lg fa-fw fa-check" : ""}></i>
            </div>
            <h5><i className="fa fa-fw fa-image"></i> Image</h5>
            <div className="box-show-on-hover">
              <div className="row">
                <div className="two columns">
                  <label htmlFor="imageUrl" className="vertical-form-label">URL </label>
                </div>
                <div className="ten columns">
                  <input name="imageUrl" className="u-full-width" type="text" placeholder="" id="imageUrl" value={this.state.question.image.url}/>
                </div>
              </div>
              <div className="row">
                <div className="two columns">
                  <label htmlFor="imageCaption" className="vertical-form-label">Caption </label>
                </div>
                <div className="ten columns">
              <input name="imageCaption" className="u-full-width" type="text" placeholder="" id="imageCaption" value={this.state.question.image.caption}/>
                </div>
              </div>
              <div className="row">
                <div className="two columns">
                  <label htmlFor="imagePublisher" className="vertical-form-label">Credit</label>
                </div>
                <div className="ten columns">
                  <input name="imagePublisher" className="u-full-width" type="text" placeholder="" id="imagePublisher" value={this.state.question.image.publisher.name}/>
                </div>
              </div>
            </div>
          </div>

          <div className="box">
            <div className="u-pull-right">
              <i className={this.state.question.video.url ? "fa fa-lg fa-fw fa-check" : ""}></i>
            </div>
            <h5><i className="fa fa-fw fa-youtube-play"></i> Video</h5>
            <div className="box-show-on-hover">
              <div className="row">
                <div className="two columns">
                  <label htmlFor="videoUrl" className="vertical-form-label">URL </label>
                </div>
                <div className="ten columns">
                  <input name="videoUrl" className="u-full-width" type="text" placeholder="" id="videoUrl" value={this.state.question.video.url}/>
                </div>
              </div>
              <div className="row">
                <div className="two columns">
                  <label htmlFor="videoCaption" className="vertical-form-label">Caption </label>
                </div>
                <div className="ten columns">
              <input name="videoCaption" className="u-full-width" type="text" placeholder="" id="videoCaption" value={this.state.question.video.caption}/>
                </div>
              </div>
              <div className="row">
                <div className="two columns">
                  <label htmlFor="videoPublisher" className="vertical-form-label">Credit</label>
                </div>
                <div className="ten columns">
                  <input name="videoPublisher" className="u-full-width" type="text" placeholder="" id="videoPublisher" value={this.state.question.video.publisher.name}/>
                </div>
              </div>
            </div>
          </div>
        </div>
          
        <h4>Answer</h4>
        {/*
        <label htmlFor="answerDetail">The answer to the question</label>
        <input name="answer" className="u-full-width" type="text" placeholder="The answer to the question." id="answer" value={this.state.question.acceptedAnswer.name}>/>
        */}
        <label htmlFor="answerDetail">The answer to the question</label>
        <Textarea name="answerDetail" className="u-full-width" placeholder="A detailed answer to the question." id="answerDetail" value={this.state.question.acceptedAnswer.text}></Textarea>
        <div className="u-cf u-full-width">
          {deleteButton}
          <p className="buttons u-pull-right">
            <Link href={questionId ? "/question?id="+questionId : "/"} as={questionId ? "/questions/"+questionId : "/"}><a href={questionId ? "/questions/"+questionId : "/"} className="button">Cancel</a></Link>
            <button type="submit" className="button-primary">Save changes</button>
          </p>
        </div>
      </form>
    )
  }
 
}