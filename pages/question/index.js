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

    return { question: question, relatedQuestions: [], session: session.getState() }
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
        imageTag = <img src={this.props.question.image} style={{width: '100%', height: 'auto'}}/>
      }

      return (
        <Page>
          <div itemScope itemType="http://schema.org/Question">
            <span itemProp="dateCreated" style={{display: "none"}}>this.props.question['@dateCreated']</span>
            <span itemProp="dateModified" style={{display: "none"}}>this.props.question['@dateModified']</span>
            <h2 itemProp="name"><strong>{this.props.question.name}</strong></h2>
            {imageTag}
            <p itemProp="text" dangerouslySetInnerHTML={{__html: (this.props.question.text) ? Marked(this.props.question.text) : "" }}></p>
            <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
              <h5>Answered <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={this.props.question['@dateModified']} /></h5>
              <p itemProp="text" dangerouslySetInnerHTML={{__html: (this.props.question.acceptedAnswer && this.props.question.acceptedAnswer.text) ? Marked(this.props.question.acceptedAnswer.text) : "This question has not been answered yet!" }}></p>
            </div>
            <p className="muted">
              <i>You may use the text of this article under the Creative Commons <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> licence.</i>
            </p>
            {editButton}
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