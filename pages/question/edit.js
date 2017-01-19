import Link from 'next/prefetch'
import React from 'react'
import Textarea from 'react-textarea-autosize'
import Layout from '../../components/layout'
import Page from '../../components/page'
import Questions from '../../models/questions'
import { Session } from '../../models/session'

export default class extends Page {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const question = await questions.get(query.id)
    
    if (!question['acceptedAnswer'])
      question['acceptedAnswer'] = { name: '', description: '' }
    
    if (!question['image'])
      question['image'] = {}
    
    if (!question['image'].publisher)
      question['image'].publisher = {}

    if (!question['video'])
      question['video'] = {}
    
    if (!question['video'].publisher)
      question['video'].publisher = {}
    
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

    if (event.target.name == "imageUrl")
      this.state.image.url = event.target.value
      
    if (event.target.name == "imageCaption")
      this.state.image.caption = event.target.value
      
    if (event.target.name == "imagePublisher")
      this.state.image.publisher.name = event.target.value

    if (event.target.name == "videoUrl")
      this.state.video.url = event.target.value
    
    if (event.target.name == "videoCaption")
      this.state.video.caption = event.target.value
    
    if (event.target.name == "videoPublisher")
      this.state.video.publisher.name = event.target.value
      
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
    window.location = "/questions/"+this.state['@id'].split('/')[4]
    // … why does calling pushTo here result in an error?
    //this.props.url.pushTo("/questions/"+this.state['@id'].split('/')[4])
  }
  
  render() {
    return (
      <Layout>
        <div className="row">
          <div className="eight columns">
            <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <h4>Question</h4>
              <label htmlFor="question">The question</label>
              <input name="question" className="u-full-width" type="text" placeholder="What is the question?" id="question" value={this.state.name}/>
              <label htmlFor="questionDetail">Optional detail to clarify the question</label>
              <Textarea name="questionDetail" className="u-full-width" placeholder="Optional detail to clarify the question." id="questionDetail" value={this.state.text}></Textarea>
              {/*
              <p className="buttons">
                <button type="button"><i className="fa fa-lg fa-fw fa-image"></i> Add image…</button>
                <button type="button"><i className="fa fa-lg fa-fw fa-play"></i> Add video…</button>
                <button type="button"><i className="fa fa-lg fa-fw fa-volume-up"></i> Add audio…</button>
              </p>
              */}
              <div className="box">
                <div className="u-pull-right">
                  <i className={this.state.image.url ? "fa fa-lg fa-fw fa-check" : ""}></i>
                </div>
                <h5><i className="fa fa-fw fa-image"></i> Image</h5>
                <div className="box-show-on-hover">
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="imageUrl" className="vertical-form-label">URL </label>
                    </div>
                    <div className="ten columns">
                      <input name="imageUrl" className="u-full-width" type="text" placeholder="" id="imageUrl" value={this.state.image.url}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="imageCaption" className="vertical-form-label">Caption </label>
                    </div>
                    <div className="ten columns">
                  <input name="imageCaption" className="u-full-width" type="text" placeholder="" id="imageCaption" value={this.state.image.caption}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="imagePublisher" className="vertical-form-label">Credit</label>
                    </div>
                    <div className="ten columns">
                      <input name="imagePublisher" className="u-full-width" type="text" placeholder="" id="imagePublisher" value={this.state.image.publisher.name}/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="box">
                <div className="u-pull-right">
                  <i className={this.state.video.url ? "fa fa-lg fa-fw fa-check" : ""}></i>
                </div>
                <h5><i className="fa fa-fw fa-youtube-play"></i> Video</h5>
                <div className="box-show-on-hover">
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="videoUrl" className="vertical-form-label">URL </label>
                    </div>
                    <div className="ten columns">
                      <input name="videoUrl" className="u-full-width" type="text" placeholder="" id="videoUrl" value={this.state.video.url}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="videoCaption" className="vertical-form-label">Caption </label>
                    </div>
                    <div className="ten columns">
                  <input name="videoCaption" className="u-full-width" type="text" placeholder="" id="videoCaption" value={this.state.video.caption}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="two columns">
                      <label htmlFor="videoPublisher" className="vertical-form-label">Credit</label>
                    </div>
                    <div className="ten columns">
                      <input name="videoPublisher" className="u-full-width" type="text" placeholder="" id="videoPublisher" value={this.state.video.publisher.name}/>
                    </div>
                  </div>
                </div>
              </div>
                
              <h4>Answer</h4>
              {/*
              <label htmlFor="answerDetail">The answer to the question</label>
              <input name="answer" className="u-full-width" type="text" placeholder="The answer to the question." id="answer" value={this.state.acceptedAnswer.name}>/>
              */}
              <label htmlFor="answerDetail">The answer to the question</label>
              <Textarea name="answerDetail" className="u-full-width" placeholder="A detailed answer to the question." id="answerDetail" value={this.state.acceptedAnswer.text}></Textarea>
              <div className="u-cf u-full-width">
                <span className="u-pull-left"><span onClick={this.handleDelete} className="button"><i className="fa fa-fw fa-lg fa-trash"></i> Delete</span></span>
                <p className="buttons u-pull-right">
                  <Link href={"/question?id="+this.state['@id'].split('/')[4]} as={"/questions/"+this.state['@id'].split('/')[4]}><a href="/" className="button">Cancel</a></Link>
                  <button type="submit" className="button-primary">Save changes</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

