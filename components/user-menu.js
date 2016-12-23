import Link from 'next/prefetch'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

/** 
 * @TODO Refactor syntax
 */
module.exports = connect(state => state)(React.createClass({
  handleLogout: function() {
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
    
    if (window.location)
      window.location = window.location
    
    return {}
  },
  startDictation: function() {
    if (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition')) {
      
      document.getElementById('search').className = "recording";
      document.getElementById('recordingButton').className += " faa-pulse animated";
      
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
      
      var recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        document.getElementById('searchInput').value = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById('search').submit();
      };

      recognition.onerror = function(e) {
        recognition.stop();
        document.getElementById('search').submit();
      }

    }
  },
  render: function() {
    let speechInput = ''
    if (typeof window !== 'undefined' && (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition')))
      speechInput = <i id="recordingButton" className="fa fa-lg fa-fw fa-microphone" onClick={this.startDictation}></i>
    
    if (this.props.sessionId) {
      return (
        <div style={{paddingTop: '40px', textAlign: 'right', position: 'relative'}}>
          <form id="search" method="get" action="/search">
            <input type="text" name="q" id="searchInput" autoComplete="off" placeholder="Ask about the news" />
            {speechInput}
          </form>
          <p style={{margin: '5px 0'}}>
            Logged in as <strong>{this.props.name}</strong>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <Link href="/question/new">New Question</Link>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <a href="#" onClick={this.handleLogout} >Logout</a>
          </p>
            {/*
          <p>
            <Link href="/question/new"><span className="button button-primary"><i className="fa fa-fw fa-plus"></i> New Question</span></Link>
          </p>
              */}
        </div>
      )
    } else {
      return (
        <div style={{paddingTop: '40px', textAlign: 'right', position: 'relative'}}>
          <form id="search" method="get" action="/search">
            <input type="text" name="q" id="searchInput" autoComplete="off" placeholder="Ask about the news" />
            {speechInput}
          </form>
        </div>
      )
    }
    
  }
}));