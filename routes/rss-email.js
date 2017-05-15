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

  // Add 50 most recently created questions to the RSS feed
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
            
            if (question.image && question.image.url && question.image.url !== '') {
              let fileName = question.image.url.split('/').pop()
              let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_400,w_600,c_fill/'+fileName
              html += '<a href="' + url + '" target="_blank"><img style="margin-top: 20px" border="0" width="100%" src="' + imageUrl + '"/></a>'

              if ('publisher' in question.image &&
                  'name' in question.image.publisher &&
                  'url' in question.image.publisher) {
                let imageCredit = question.image.publisher.name
                html += '<p style="text-align: right;"><small> Image Credit: <a href="' + question.image.publisher.url + '">' + question.image.publisher.name + '</a></small></p>'
              }
            }

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