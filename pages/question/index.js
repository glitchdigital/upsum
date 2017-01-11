import Head from 'next/head'
import Link from 'next/prefetch'
import React from 'react'
import Page from '../../layouts/main'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    
    // Get question
    const question = await questions.get(query.id)
    if (!question['acceptedAnswer'])
      question['acceptedAnswer'] = { name: '', description: '' };

    // When running on the server we get related questions in getInitialProps() 
    // When running in the browser we can fetch them after the page load in
    // componentDidMount() to improve page rendering time.
    
    let relatedQuestions = []
    if (typeof window === 'undefined' && question['@id'])
      relatedQuestions = await this.getRelatedQuestions(question)
    
    return {
      id: query.id,
      question: question,
      relatedQuestions: relatedQuestions,
      session: session.getState()
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      relatedQuestions: props.relatedQuestions
    }
  }

  // This is called on initial page load
  async componentDidMount() {
    const relatedQuestions = await this.constructor.getRelatedQuestions(this.props.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions
    })
  }
  
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)
    
    // Update state
    this.setState({
      relatedQuestions: relatedQuestions
    })
  }

  // Get related questions
  static async getRelatedQuestions(question) {
    if (!question['@id'])
      return

    const questions = new Questions

    let searchQuery = question.name

    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: 6, name: searchQuery })
    
    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)

    })
    return relatedQuestions
  }
   
  render() {
    if (this.props.question['@id']) {
      
      let editButton
      if (this.props.session.sessionId) {
        editButton = <p style={{textAlign: "right"}}><Link href={"/question/edit?id="+this.props.id} as={"/questions/edit/"+this.props.id}><span className="button"><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</span></Link></p>
      } else {
        editButton = <span/>
      }
      
      let imageTag
      if (this.props.question.image) {
        imageTag = 
          <div>
            <div className="question-image" style={{backgroundImage: 'url('+this.props.question.image+')'}}></div>
          </div>
      }

      let answeredOn = <div><h5>This question has not been answered yet!</h5></div>
      if (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text)
        answeredOn =
          <div>
            <h5>
                <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={this.props.question['@dateModified']} />
            </h5>
          </div>
        
      return (
        <Page>
          <Head>
            <title>{this.props.question.name}</title>
          </Head>
          <div itemScope itemType="http://schema.org/Question">
            <div className="row">
              <div className="twelve columns">
                <span itemProp="dateCreated" style={{display: "none"}}>{this.props.question['@dateCreated']}</span>
                <span itemProp="dateModified" style={{display: "none"}}>{this.props.question['@dateModified']}</span>
                <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
              </div>
            </div>
            <div className="row">
              <div className="eight columns">
                {imageTag}
                <ReactMarkdown source={this.props.question.text || ''}/>
                <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                {answeredOn}
                  <div itemProp="text">
                    <ReactMarkdown source={(this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? this.props.question.acceptedAnswer.text : "" }/>
                  </div>
                </div>
                {editButton}
              </div>
              <div className="four columns">
                <div className="question-sidebar">
                  <h4>More Questions</h4>
                  {
                    this.state.relatedQuestions.map((question, i) => (
                      <div key={i}>
                        <p>
                          <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>{question.name}</Link>
                          <br/>
                          <span className="muted"><i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question['@dateModified']} /></span>
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="twelve columns">
              <p className="muted" style={{fontSize: '15px', marginBottom: '5px'}}>
                <i>You may use the text of this article under the terms of the Creative Commons <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> licence.</i>
              </p>
              <p className="muted" style={{fontSize: '15px'}}>
                <i>Images via <a href="http://flickr.com">flickr.com</a> and marked suitable for both non-commercial and commercial re-use (note: image credits are currently missing).</i>
              </p>
            </div>
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