import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import TimeAgo from 'react-timeago'
import LazyLoad from 'react-lazy-load'

export default class extends React.Component {
  
  render() {
    const question = this.props.question
    
    let imageTag
    if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
      let fileName = question.image.url.split('/').pop()
      let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_600,c_fill/'+fileName
      imageTag = 
        <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>
          <a className="question-card-image-container"><LazyLoad offsetVertical={300}><div className="question-card-image" style={{backgroundImage: 'url('+imageUrl+')'}}></div></LazyLoad></a>
        </Link>      
    }

    let datePublished = question['@dateModified']
    if (question.acceptedAnswer && question.acceptedAnswer.datePublished) {
      datePublished = question.acceptedAnswer.datePublished
    }
    
    return(
      <div className="question-card-preview" onClick={ () => Router.push("/question?id="+question['@id'].split('/')[4], "/questions/"+question['@id'].split('/')[4]) }>
        {imageTag}
        <div className="question-card-contents">
          <h3 style={{marginBottom: '10px'}}><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}><a className="unstyled">{question.name}</a></Link></h3>
          <p className="date-label">
            <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={datePublished} />
          </p>
        </div>
      </div>
    )
  }
  
}