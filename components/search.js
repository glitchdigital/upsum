import Link from 'next/prefetch'
import React from 'react'
import { connect } from 'react-redux'
import { Session } from '../models/session'

export default class extends React.Component {
  
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
    let speechInput = ''
    if (typeof window !== 'undefined' && (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition')))
      speechInput = <i id="recordingButton" className="fa fa-lg fa-fw fa-microphone" onClick={this.startDictation}></i>
    
    return (
      <div className="search">
        <form id="search" method="get" action="/search">
          <input className="search-input" type="text" name="q" id="searchInput" autoComplete="off" placeholder="Ask about the news…" />
          {speechInput}
        </form>
      </div>
    )
  }
  
}