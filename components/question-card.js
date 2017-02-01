import React from 'react'
import Link from 'next/prefetch'
import TimeAgo from 'react-timeago'

export default class extends React.Component {
  
  render() {
    const question = this.props.question
    let imageTag
    /*
    if (question.image && question.image.url) {
      imageTag = 
        <Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}>
          <a href={"/question?id="+question['@id'].split('/')[4]}><div className="question-card-image" style={{backgroundImage: 'url('+question.image.url+')'}}></div></a>
        </Link>
    }
    */
    return(
      <div className="question-card" onClick={ () => this.props.url.push("/question?id="+question['@id'].split('/')[4], "/questions/"+question['@id'].split('/')[4]) }>
        <h3 style={{marginBottom: '10px'}}><Link href={"/question?id="+question['@id'].split('/')[4]} as={"/questions/"+question['@id'].split('/')[4]}><a href={"/question?id="+question['@id'].split('/')[4]}>{question.name}</a></Link></h3>
        {imageTag}
        <p className="date-label">
          <i className="fa fa-fw fa-clock-o"></i> <TimeAgo date={question['@dateModified']} />
        </p>
      </div>
    )
  }
  
}