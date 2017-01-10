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
      question: props.question,
      relatedQuestions: props.relatedQuestions
    }
  }

  // This is called on initial page load
  async componentDidMount() {
    const relatedQuestions = await this.constructor.getRelatedQuestions(this.state.question)
    
    // Update state
    this.setState({
      question: this.state.question,
      relatedQuestions: relatedQuestions
    })
  }
  
  // This is called any time the question changes
  // e.g. a related question is clicked on in the sidebar
  async componentWillReceiveProps(nextProps) {
    const relatedQuestions = await this.constructor.getRelatedQuestions(nextProps.question)
    
    // Update state
    this.setState({
      question: nextProps.question,
      relatedQuestions: relatedQuestions
    })
  }

  // Get related questions
  static async getRelatedQuestions(question) {
    if (!question['@id'])
      return

    const questions = new Questions

    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: 6, name: question.name })
    
    // Don't include the question on this page as a related question
    relatedQuestions.forEach((relatedQuestion, index) => {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)

    })
    return relatedQuestions
  }
   
  render() {
    if (this.state.question['@id']) {
      
      let editButton
      if (this.props.session.sessionId) {
        editButton = <p style={{textAlign: "right"}}><Link href={"/question/edit?id="+this.props.id} as={"/questions/edit/"+this.props.id}><span className="button"><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</span></Link></p>
      } else {
        editButton = <span/>
      }
      
      let imageTag
      if (this.state.question.image) {
        imageTag = <img src={this.state.question.image} style={{width: '100%', height: 'auto', marginBottom: '20px'}}/>
      }

      return (
        <Page>
          <Head>
            <title>{this.state.question.name}</title>
          </Head>
          <div itemScope itemType="http://schema.org/Question">
            <div className="row">
              <div className="twelve columns">
                <span itemProp="dateCreated" style={{display: "none"}}>{this.state.question['@dateCreated']}</span>
                <span itemProp="dateModified" style={{display: "none"}}>{this.state.question['@dateModified']}</span>
                <h2 itemProp="name"><strong>{this.state.question.name}</strong></h2>
              </div>
            </div>
            <div className="row">
              <div className="eight columns">
                {imageTag}
                <ReactMarkdown source={this.state.question.text || ''}/>
                <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                  <h5>Answered <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={this.state.question['@dateModified']} /></h5>
                  <div itemProp="text">
                    <ReactMarkdown source={(this.state.question.acceptedAnswer && this.state.question.acceptedAnswer.text) ? this.state.question.acceptedAnswer.text : "This question has not been answered yet!" }/>
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
              <p className="muted">
                <i>You may use the text of this article under the terms of the Creative Commons <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> licence.</i>
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