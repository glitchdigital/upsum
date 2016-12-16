import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { Session } from '../models/session'

module.exports = connect(state => state)(React.createClass({
  handleLogout: function() {
    const session = Session()
    session.dispatch({ type: 'LOGOUT' })
    
    if (window.location)
      window.location = window.location
    
    return {}
  },
  startDictation: function() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        document.getElementById('transcript').value = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById('search').submit();
      };

      recognition.onerror = function(e) {
        recognition.stop();
      }

    }
  },
  render: function() {
    if (this.props.sessionId) {
      return (
        <div style={{paddingTop: '40px', textAlign: 'right'}}>
          <form id="search" method="get" action="/search">
            <input type="text" name="q" id="transcript" placeholder="Got a question?" />
            <i className="fa fa-lg fa-fw fa-microphone" onClick={this.startDictation}></i>
          </form>
          <p style={{margin: '5px 0'}}>
            Logged in as <strong>{this.props.name}</strong>
            &nbsp;<span style={{opacity: '.25'}}>|</span>&nbsp;
            <Link href="/question/new">New Question…</Link>
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
        <div style={{paddingTop: '40px', textAlign: 'right'}}>
          <form id="search" method="get" action="/search">
            <input type="text" name="q" id="transcript" placeholder="Got a question?" />
            <i className="fa fa-lg fa-fw fa-microphone" onClick={this.startDictation}></i>
          </form>
        </div>
      )
    }
    
  }
}));