import Link from 'next/link'
import Router from 'next/router'
import React from 'react'
import Images from '../models/images'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: this.props.text,
      images: []
    }
  }
  
  async componentWillMount() {
    const images = new Images()
    this.setState({
      text: this.props.text,
      images: await images.search(this.props.text)
    })
  }

  // Only redraw when getting new props if the text is different
  async componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      const images = new Images()
      this.setState({
        text: nextProps.text,
        images: await images.search(nextProps.text)
      })
    }
  }

  // Don't redraw unless we have all new text to search on in props
  shouldComponentUpdate(nextProps, nextState) {
    if (!('text' in this.props)) {
      return true
    }
      
    if (nextProps.text === 'undefined' ||
        nextProps.text.trim() === '' ||
        nextProps.text === this.props.text) {
      if (nextState.text === this.state.text) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }
  
  render() {
    if (this.state.images.length > 0) {
      return(
        <div>
          <p>Found {this.state.images.length} images</p>
          {
            this.state.images.map((image, i) => {
              return <span key={'image-'+i}><span onClick={() => this.props.addImage(image)}><span className="image-thumbnail" style={{backgroundImage: 'url('+image.thumbnail.src+')'}}></span></span></span>
            })
          }
        </div>
      )
    } else {
      return(
        <div>
          <p style={{display: (this.props.text && this.props.text !== '') ? 'block' : 'none' }}><p>Found 0 images</p></p>
        </div>
      )
    }
  }
  
}