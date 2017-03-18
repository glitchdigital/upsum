'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')
const RSS = require('rss')

exports.get = (req, res, next) => {
  var rssFeed = new RSS({
    title: 'Upsum',
    description: 'The news, summed up',
    feed_url: 'https://upsum.news/rss.xml',
    site_url: 'https://upsum.news/',
    image_url: 'https://upsum.news/static/images/upsum-logo-share-twitter.png',
    language: 'en',
    pubDate: new Date().toString(),
    ttl: '60'
  })

  // Add 50 most recently updated questions to the RSS feed
  fetch('https://api.upsum.news/Question?sort=-_created&limit=50')
  .then(function(response) {
    response.json()
    .then(function(json) {
      if (json instanceof Array) {
        json.forEach(function(question, index) {
          // Only add questions with answers to the feed!
          if ('acceptedAnswer' in question && 'text' in question.acceptedAnswer && question.acceptedAnswer.text !== '') {
            let url = 'https://upsum.news/questions/'+question['@id'].split('/')[4]
            let html = ''
            if ('text' in question && question.text !== '') {
              html += '<div style="font-style: oblique;">'+marked(question.text)+'</div>'
            }
            html += marked(question.acceptedAnswer.text)
            if ('citation' in question.acceptedAnswer && question.acceptedAnswer.citation !== '') {
              html += '<p><strong>Sources:</strong></p>'
                   +marked(question.acceptedAnswer.citation)
            }
            rssFeed.item({
                title: question.name,
                description: html,
                url: url,
                date: question['@dateCreated']
            })
          }
        })
      }
      res.send(rssFeed.xml())
    })
  })
}