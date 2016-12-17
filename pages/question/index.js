import React from 'react'
import Link from 'next/link'
import Page from '../../layouts/main'
import Questions from '../../models/questions'
import { Session } from '../../models/session'
import Marked from 'Marked'
import TimeAgo from 'react-timeago'

Marked.setOptions({
  renderer: new Marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

export default class extends React.Component {
  
  static async getInitialProps({ req, query }) {
    const session = Session(req)
    const questions = new Questions
    const question = await questions.get(query.id)
    
    if (!question['acceptedAnswer'])
      question['acceptedAnswer'] = { name: '', description: '' };

    // Get questions that have a similar title
    const relatedQuestions = await questions.search({ limit: 6, name: question.name })
    
    // Don't include the question on this page as a related question
    relatedQuestions.forEach(function(relatedQuestion, index) {
      if (question['@id'] == relatedQuestion['@id'])
        relatedQuestions.splice(index, 1)
    });
    
    return { question: question, relatedQuestions: relatedQuestions, session: session.getState() }
  }
   
  render() {
    if (this.props.question['@id']) {
      
      let editButton
      if (this.props.session.sessionId) {
        editButton = <p style={{textAlign: "right"}}><a className="button" href={"/questions/edit/"+this.props.question['@id'].split('/')[4]}><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</a></p>
      } else {
        editButton = <span/>
      }
      
      let imageTag
      if (this.props.question.image) {
        imageTag = <img src={this.props.question.image} style={{width: '100%', height: 'auto', marginBottom: '20px'}}/>
      }

      return (
        <Page>
          <div itemScope itemType="http://schema.org/Question">
            <div className="row">
              <div className="twelve columns">
                <span itemProp="dateCreated" style={{display: "none"}}>this.props.question['@dateCreated']</span>
                <span itemProp="dateModified" style={{display: "none"}}>this.props.question['@dateModified']</span>
                <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
              </div>
            </div>
            <div className="row">
              <div className="eight columns">
                {imageTag}
                <span itemProp="text" dangerouslySetInnerHTML={{__html: (this.props.question.text) ? Marked(this.props.question.text) : "" }}></span>
                <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
                  <h5>Answered <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={this.props.question['@dateModified']} /></h5>
                  <p itemProp="text" dangerouslySetInnerHTML={{__html: (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? Marked(this.props.question.acceptedAnswer.text) : "This question has not been answered yet!" }}></p>
                </div>
                {editButton}
              </div>
              <div className="four columns">
                <div style={{backgroundColor: "#e5e5e5", padding: '5px 10px', marginBottom: '20px'}}>
                  <h4>More Questions</h4>
                  {
                    this.props.relatedQuestions.map((question, i) => (
                      <div key={i}>
                        <p>
                          <a href={"/questions/"+question['@id'].split('/')[4]}>{question.name}</a>
                          <br/>
                          <span className="muted"><i className="fa fa-fw fa-clock-o"></i><TimeAgo date={question['@dateModified']} /></span>
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