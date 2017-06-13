import Link from 'next/link'
import React from 'react'
import TimeAgo from 'react-timeago'
import ReactMarkdown from 'react-markdown'

export default class extends React.Component {
  
  popup(e) {
    // Get href or (if icon element clicked directly) parent node's href
    let target = e.target.href || e.target.parentNode.href
    window.open(target, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600')
    e.preventDefault()
    return false
  }

  render() {
    const question = this.props.question
    const questionId = question['@id'].split('/')[4]

    // Define URLs for sharing
    let shareUrl = 'https://upsum.news/questions/' + questionId
    let shareImageTwitter = 'https://upsum.news/static/images/upsum-logo-share-twitter.png'
    let shareImageFacebook = 'https://upsum.news/static/images/upsum-logo-share-facebook-v2.png'

    if ('image' in question &&
        'url' in question.image &&
        question.image.url != '') {
      let fileName = question.image.url.split('/').pop()
      shareImageTwitter = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
      shareImageFacebook = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,w_1200,c_fill/'+fileName
    }
        
    let imageTag
    if (question.image && question.image.url) {
      let fileName = question.image.url.split('/').pop()
      let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
      imageTag = 
        <div>
          <div className="question-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div>
          <p className="question-image-text">
            <span className="image-caption">{(question.image.caption) ? question.image.caption + '. ' : ''}</span>
            <span className="image-credit"><a target="_blank" href={question.image.publisher.url || 'https://upsum.news'}><i className="fa fa-flickr"/> {question.image.publisher.name || 'Upsum'}</a></span>
          </p>
        </div>
    }

    let videoTag
    if (question.video && question.video.url) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      /*
      var match = question.video.url.match(regExp)
      if (match && match[2].length == 11) {
        const videoEmbedUrl = "//www.youtube.com/embed/"+match[2]
        videoTag =
          <div className="question-video">
            <iframe width="100%" height="400" src={videoEmbedUrl} frameBorder="0" allowFullScreen></iframe>
          </div>
      }
      */
    }

    let datePublished = question['@dateModified']
    if ('acceptedAnswer' in question
        && 'datePublished' in question.acceptedAnswer
        && question.acceptedAnswer.datePublished !== '') {
      datePublished = question.acceptedAnswer.datePublished
    }
    
    let answeredOn
    if (question.acceptedAnswer && question.acceptedAnswer.text) {
      answeredOn =
        <span className="date-label">
          <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={datePublished} />
        </span>
    }
    
    let citation
    if (question.acceptedAnswer && question.acceptedAnswer.citation)
      citation = 
        <div>
          <h5>Sources</h5>
          <div className="muted">
            <ReactMarkdown source={question.acceptedAnswer.citation}/>
         </div>
        </div>

    let editButton
    if (this.props.session.sessionId) {
      editButton = <Link href={"/question/edit?id="+questionId} as={"/questions/edit/"+questionId}><a className="button"><i className="fa fa-fw fa-lg fa-pencil"></i> Edit</a></Link>
    } else {
      editButton = <span/>
    }
    
    let footer
    if (this.props.footer) {
      footer = <div className="question-card-contents"><p className="question-card-footer"><Link href={"/question?id="+questionId} as={"/questions/"+questionId}><a>{this.props.footer}</a></Link></p></div>
    }

    return(
      <div className="question-card" itemScope itemType="http://schema.org/Question">
        <div className="question-card-contents">
          <h2 itemProp="name"><strong>{question.name}</strong></h2>
          <div style={{display: 'none'}}>
            <span itemProp="url">{shareUrl}</span><br/>
            <span itemProp="datePublished">{datePublished}</span><br/>
            <span itemProp="dateCreated">{question['@dateCreated']}</span><br/>
            <span itemProp="dateModified">{question['@dateModified']}</span><br/>
          </div>
        </div>
        <div className="question-card-contents">
          {answeredOn}
          <div className="buttons pull-right">
            <a target="_blank" onClick={this.popup} className="button button-facebook" href={"http://www.facebook.com/sharer.php?u=" + encodeURIComponent(shareUrl) + "&t=" + encodeURIComponent(question.name)} title="Share on Facebook..."><i className="fa fa-fw fa-lg fa-facebook"/> <span className="hidden-mobile">Share</span></a>
            <a target="_blank" onClick={this.popup} className="button button-twitter" href={"https://twitter.com/share?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(question.name)}><i className="fa fa-fw fa-lg fa-twitter"/> <span className="hidden-mobile">Tweet</span></a>
          </div>
        </div>
        {imageTag}
        {videoTag}
        <div className="question-card-contents">
          <div className="question-card-question-text">
            <ReactMarkdown source={question.text || ''}/>
          </div>
          <div itemProp="suggestedAnswer acceptedAnswer" itemScope itemType="http://schema.org/Answer">
            <div itemProp="text">
              <ReactMarkdown source={(question.acceptedAnswer && question.acceptedAnswer.text) ? question.acceptedAnswer.text : '*This question has not been answered yet!*' }/>
            </div>
          </div>
          {citation}
          <div className="buttons">
            {editButton}
          </div>
        </div>
        <div id="question-card-advert-1"></div>
        {footer}
      </div>
    )
  }
  
}