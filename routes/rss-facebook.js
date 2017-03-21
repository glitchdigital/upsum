'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')
const RSS = require('rss')

exports.get = (req, res, next) => {
  var rssFeed = new RSS({
    title: 'Upsum',
    description: 'The news, summed up',
    feed_url: 'https://upsum.news/rss-facebook.xml',
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
            
            if (question.image && question.image.url && question.image.url !== '' && question.image.url !== 'undefined') {
              let fileName = question.image.url.split('/').pop()
              let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
              let imageCredit = 'Upsum'
              if ('publisher' in question.image &&
                  'name' in question.image.publisher &&
                  'url' in question.image.publisher) {
                imageCredit = question.image.publisher.name
              }

              html += `<figure>
<img src="${imageUrl}"/>
  <figcaption class="op-vertical-below">
    <cite>
      ${imageCredit}
    </cite>
  </figcaption>
</figure>`
            }
            
            html += `<h1>${question.name}</h1>`
            
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