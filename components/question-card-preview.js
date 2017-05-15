import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import TimeAgo from 'react-timeago'

export default class extends React.Component {

  clickPreview(e, url, as) {
    // Don't trigger navigation on this page if modifer key held down
    // (avoids overriding browser behaviour such as open in new tab or window)
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e.nativeEvent && e.nativeEvent.which === 2)) {
      return
    }
    Router.push(url, as)
  }
  
  render() {
    const question = this.props.question
    const questionId = question['@id'].split('/')[4]
    
    let className = this.props.className || 'question-card-preview'

    let imageTag
    if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
      let fileName = question.image.url.split('/').pop()
      let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
      imageTag = <div className="question-card-image-container">
          <Link href={"/question?id="+questionId} as={"/questions/"+questionId}>
            <a><div className="question-card-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div></a>
          </Link>
        </div>
       className += ' has-image'
    }

    let datePublished = question['@dateModified']
    if ('acceptedAnswer' in question
        && 'datePublished' in question.acceptedAnswer
        && question.acceptedAnswer.datePublished !== '') {
      datePublished = question.acceptedAnswer.datePublished
    }

    return(
      <div className={className} onClick={ (e) => this.clickPreview(e, "/question?id="+questionId, "/questions/"+questionId)}>
        {imageTag}
        <div className="question-card-contents">
          <h3><Link href={"/question?id="+questionId} as={"/questions/"+questionId}><a className="unstyled">{question.name}</a></Link></h3>
          <div className="question-card-question-text">
            <ReactMarkdown source={question.text || ''}/>
          </div>
          <p className="date-label">
            <i className="fa fa-fw fa-clock-o"></i><TimeAgo date={datePublished} />
          </p>
        </div>
      </div>
    )
  }
  
}