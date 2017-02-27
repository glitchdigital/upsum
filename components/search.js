import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

export default class extends React.Component {
  
  constructor(props) {
    super(props)
    this.session = Session()
    this.state = {
      speechInputStyle: { display: 'none'}
    }
  }

  async componentDidMount() {
    if (typeof window !== 'undefined' && (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition')))
      this.setState({ speechInputStyle: { display: 'block'} })
  }
  
  startDictation() {
    if (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition')) {
      
      document.getElementById('search').className = "recording";
      document.getElementById('recordingButton').className += " faa-pulse animated";
      
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
      
      var recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();
      
      document.getElementById('searchInput').value = "Listening…"

      recognition.onresult = function(e) {
        document.getElementById('searchInput').value = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById('search').submit();
      };

      recognition.onerror = function(e) {
        recognition.stop();
        document.getElementById('searchInput').value = ""
        document.getElementById('search').submit();
      }

    }
  }
  
  render() {
    return (
      <div className="search">
        <form id="search" method="get" action="/search">
          <input className="search-input" type="text" name="q" id="searchInput" autoComplete="off" placeholder="Ask about the news…" />
          <i style={this.state.speechInputStyle} id="recordingButton" className="fa fa-lg fa-fw fa-microphone" onClick={this.startDictation}></i>
        </form>
      </div>
    )
  }
  
}