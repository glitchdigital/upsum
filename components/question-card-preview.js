import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  render() {
    const question = this.props.question
    let className = this.props.className || 'question-card-preview'

    let imageTag
    if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
      let fileName = question.image.url.split('/').pop()
      let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
      imageTag = <div className="question-card-image-container">
          <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>
            <a><div className="question-card-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div></a>
          </Link>
        </div>
       className += ' has-image'
    }

    let datePublished = question['@dateModified']
    if (question.acceptedAnswer && question.acceptedAnswer.datePublished) {
      datePublished = question.acceptedAnswer.datePublished
    }

    return(
      <div className={className} onClick={ () => Router.push("/question?id="+question['@id'].split('/')[4], "/questions/"+question['@id'].split('/')[4]) }>
        {imageTag}
        <div className="question-card-contents">
          <h3><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}><a className="unstyled">{question.name}</a></Link></h3>
          <p className="date-label">
            <i className="fa fa-fw fa-clock-o"></i><TimeAgo date={datePublished} />
          </p>
        </div>
      </div>
    )
  }
  
}