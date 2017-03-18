'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')
const ampl = require('ampl')

exports.get = (req, res, next) => {
  fetch('https://api.upsum.news/Question/'+req.params.id)
  .then(function(response) {
    response.json()
    .then(function(question) {
      let markdownString = '[upsum.news](https://upsum.news/)\n\n# ' + question.name+'\n\n'

      if ('image' in question &&
          'url' in question.image &&
          question.image.url != '') {
        let fileName = question.image.url.split('/').pop()
        let imageURL = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
        markdownString += '!['+question.name+']('+imageURL+')\n\n'
        if ('publisher' in question.image &&
            'name' in question.image.publisher &&
            'url' in question.image.publisher) {
          markdownString += '*Image credit: ['+question.image.publisher.name +']('+question.image.publisher.url+')*\n\n'
        }
      }

      if ('text' in question && question.text !== '') {
        markdownString += question.text+'\n\n'
      }
      
      if ('acceptedAnswer' in question &&
          'text' in question.acceptedAnswer &&
          question.acceptedAnswer.text !== '') {
            markdownString += question.acceptedAnswer.text+'\n\n'
      }
      
      if ('acceptedAnswer' in question &&
          'citation' in question.acceptedAnswer &&
          question.acceptedAnswer.citation !== '') {
        markdownString += "Sources:\n\n"+question.acceptedAnswer.citation
      }

      markdownString += '\n\n[Read more at upsum.news](https://upsum.news/)'

      ampl.parse(markdownString, {
        canonicalUrl: 'https://upsum.news/questions/' + req.params.id,
        style: 'body{max-width: 660px; font-size: 18px; line-height: 24px; background: #eee; color: #444; margin: 0; padding: 0 20px; margin: 0; font-family: sans-serif;} h1 {margin: 0; font-size: 30px; line-height: 38px;} a {color: #444; font-weight: 300; text-decoration: none;} blockquote{color: #666; border-left: 2px solid #ddd; margin-left: 10px; padding-left: 20px; font-style: italic;}'
      }, function(ampHtml) {
        // Hack to fix known bug in ampl which puts doctype in the wrong place
        ampHtml = ampHtml.replace(/<!doctype html>/, '')
        res.send("<!doctype html>" + ampHtml)
      })
    })
  })  
}