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
            <ol className="breadcrumbs" itemScope itemType="http://schema.org/BreadcrumbList">
              <li>
                <Link href="/"><a><i className="fa fa-fw fa-home"/> Home</a></Link>
              </li>
              {
                breadcrumbs.map((item, i) => {
                  return <li key={i} itemProp="itemListElement" itemScope
      itemType="http://schema.org/ListItem">
                      <i className="fa fa-fw fa-chevron-right separator"/>
                      <Link href={item.href}><a itemScope itemType="http://schema.org/Thing"
       itemProp="item"><span itemProp="name">{item.name}</span></a></Link>
                      <meta itemProp="position" content={i+1}/>
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
