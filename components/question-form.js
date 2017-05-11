import Router from 'next/router'
import Link from 'next/link'
import React from 'react'
import ReactDOM from 'react-dom'
import TimeAgo from 'react-timeago'
import Textarea from 'react-textarea-autosize'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Questions from '../models/questions'
import { Session } from '../models/session'
import Images from '../components/images'
import ImagesModel from '../models/images'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      question: this.props.question,
      imageSearchTextInput: '',
      imageSearchText: ''
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDatePublishedChange = this.handleDatePublishedChange.bind(this)
    this.handleImageSearchSubmit = this.handleImageSearchSubmit.bind(this)
    this.handleImageSearchClear = this.handleImageSearchClear.bind(this)
    this.handleAddImage = this.handleAddImage.bind(this)
    this.handleImageRemoveImage = this.handleImageRemoveImage.bind(this)
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

   handleImageSearchClear() {
     this.setState({
       question: this.state.question,
       imageSearchTextInput: '',
       imageSearchText: ''
     })
   }
  
  handleImageSearchSubmit() {
    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchTextInput
    })
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
      
    if (event.target.name == "imagePublisherName")
      this.state.question.image.publisher.name = event.target.value
      
    if (event.target.name == "imagePublisherUrl")
      this.state.question.image.publisher.url = event.target.value

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

    if (event.target.name == "answerCitation")
      this.state.question.acceptedAnswer.citation = event.target.value

    if (event.target.name == "imageSearchText")
      this.state.imageSearchTextInput = event.target.value

    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchText
    })
  }

  handleDatePublishedChange(date) {
    this.state.question.acceptedAnswer.datePublished = date.toDate()
    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchText
    })
  }
  
  async handleAddImage(image) {
    this.state.question.image.url = "https://upsum.news/static/images/upsum-logo-share-twitter.png"
    this.state.question.image.publisher.name = image.owner
    this.state.question.image.publisher.url = image.url
    this.state.question.image.caption = image.description
    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchText
    })
    
    const images = new ImagesModel()
    const json = await images.deployToCDN(image.image.src)
    this.state.question.image.url = json.secure_url
    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchText
    })
  }
  
  handleImageRemoveImage() {
    this.state.question.image = {
      publisher: {}
    }
    this.setState({
      question: this.state.question,
      imageSearchTextInput: this.state.imageSearchTextInput,
      imageSearchText: this.state.imageSearchText
    })
  }
    
  async handleSubmit(event) {
    event.preventDefault()

    // If image search field has focus perform search instead of submitting
    if (document.activeElement === ReactDOM.findDOMNode(this.refs.imageSearchInput)) {
      this.handleImageSearchSubmit()
      return
    }
    
    if (this.state.question.name.trim() === '') {
      alert('Enter a question before saving changes')
      return
    }
    
    if (this.state.question.acceptedAnswer.name.trim() === '' &&
        this.state.question.acceptedAnswer.text.trim() === '') {
      alert('Enter an answer before saving changes')
      return
    }
    
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

    let imageTag
    if (this.state.question.image && this.state.question.image.url) {
      let imageUrl = this.state.question.image.url
      let fileName = this.state.question.image.url.split('/').pop()
      if (fileName !== 'upsum-logo-share-twitter.png') {
        imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
      }
      imageTag = 
        <div>
          <div className="question-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div>
            <p className="question-image-text">
              <span className="image-caption">{(this.state.question.image.caption) ? this.state.question.image.caption + '. ' : ''}</span>
              <span className="image-credit"><a target="_blank" href={this.state.question.image.publisher.url || 'https://upsum.news'}><i className="fa fa-flickr"/> {this.state.question.image.publisher.name || 'Upsum'}</a></span>
            </p>
        </div>
    }

    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <label htmlFor="question">Question</label>
        <input name="question" className="u-full-width" type="text" placeholder="What is the question?" id="question" value={this.state.question.name}/>
        <label htmlFor="questionDetail">Detail to clarify the question (optional)</label>
        <Textarea name="questionDetail" className="u-full-width" placeholder="Optional detail to clarify the question." id="questionDetail" value={this.state.question.text}></Textarea>
        {/*
        <p className="buttons">
          <button type="button"><i className="fa fa-lg fa-fw fa-image"></i> Add image…</button>
          <button type="button"><i className="fa fa-lg fa-fw fa-play"></i> Add video…</button>
          <button type="button"><i className="fa fa-lg fa-fw fa-volume-up"></i> Add audio…</button>
        </p>
        */}

        <div style={{display: (this.state.question.image.url) ? 'none' : 'block'}}>
          <div style={{overflow: 'auto'}}>
            <i style={{float: 'left', marginRight: '5px', position: 'relative', top: '10px'}} className="fa fa-lg fa-fw fa-image"/>
            <input ref="imageSearchInput" style={{float: 'left', marginRight: '5px'}} name="imageSearchText" autoComplete="off" type="text" placeholder="Search for image…" value={this.state.imageSearchTextInput}/>
            <button style={{float: 'left', marginRight: '5px'}} type="button" onClick={this.handleImageSearchSubmit}>Search</button>
            <button style={{float: 'left'}} type="button" onClick={this.handleImageSearchClear}>Clear</button>
          </div>
          <Images text={this.state.imageSearchText} addImage={this.handleAddImage}/>
        </div>

        <div>
          <div style={{display: (this.state.question.image.url) ? 'block' : 'none'}}>
            <div style={{marginBottom: '10px'}}>{imageTag}</div>
            <div className="row" style={{display: 'none'}}>
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
                <label htmlFor="imagePublisherName" className="vertical-form-label">Credit</label>
              </div>
              <div className="ten columns">
                <input name="imagePublisherName" className="u-full-width" type="text" placeholder="" id="imagePublisherName" value={this.state.question.image.publisher.name}/>
              </div>
            </div>
            <div className="row">
              <div className="two columns">
                <label htmlFor="imagePublisherUrl" className="vertical-form-label">Link</label>
              </div>
              <div className="ten columns">
                <input name="imagePublisherUrl" className="u-full-width" type="text" placeholder="" id="imagePublisherUrl" value={this.state.question.image.publisher.url}/>
              </div>
            </div>
            <p className="buttons">
              <button type="button" onClick={this.handleImageRemoveImage}><i className="fa fa-lg fa-fw fa-ban"/> Remove image</button>
            </p>
          </div>

          <div style={{display: 'none'}} className="box">
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
        {/*
        <label htmlFor="answerDetail">The answer to the question</label>
        <input name="answer" className="u-full-width" type="text" placeholder="The answer to the question." id="answer" value={this.state.question.acceptedAnswer.name}>/>
        */}
        <label htmlFor="answerDetail">Answer to the question</label>
        <Textarea name="answerDetail" className="u-full-width" placeholder="A detailed answer to the question." id="answerDetail" value={this.state.question.acceptedAnswer.text}></Textarea>
        <label htmlFor="answerCitation">Sources (optional)</label>
        <Textarea name="answerCitation" className="u-full-width" placeholder="The source(s) being cited" id="answerCitation" value={this.state.question.acceptedAnswer.citation}></Textarea>
        <label htmlFor="answerDatePublished">Date Answered</label>
        <i className="fa fa-fw fa-calendar"/> <DatePicker fixedHeight todayButton={"Today"} dateFormat="YYYY-MM-DD" selected={moment(this.state.question.acceptedAnswer.datePublished)} onChange={this.handleDatePublishedChange}/>
        <p className="muted">
          <i>"Date Answered" should be left unchanged for minor edits (correcting typos, formatting changes, etc.) but updated for significant edits.</i>
        </p>
        <div className="u-cf u-full-width">
          {deleteButton}
          <p className="buttons u-pull-right">
            <Link href={questionId ? "/question?id="+questionId : "/"} as={questionId ? "/questions/"+questionId : "/"}><a className="button">Cancel</a></Link>
            <button type="submit" className="button-primary">Save changes</button>
          </p>
        </div>
      </form>
    )
  }
 
}