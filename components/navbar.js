import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'

export default class extends React.Component {
  render() {
    const breadcrumbs = this.props.breadcrumbs || []
    return (
      <div className="navbar">
        <div className="row">
          <div className="twelve columns">
            <ol className="breadcrumbs">
              <li><Link href="/"><a><i className="fa fa-fw fa-home"/> Home</a></Link></li>
              {
                breadcrumbs.map((item, i) => {
                  return <li key={i}>
                      <i className="fa fa-fw fa-chevron-right separator"/>
                      <Link href={item.href}><a>{item.name}</a></Link>
                    </li>
                })
              }
            </ol>
          </div>
        </div>
      </div>
    )
  }
}
