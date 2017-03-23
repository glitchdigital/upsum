'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')
const RSS = require('rss')
const escapeHtml = require('escape-html')

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

  // Add 100 most recently created questions to the RSS feed
  fetch('https://api.upsum.news/Question?sort=-_created&limit=100')
  .then(function(response) {
    response.json()
    .then(function(json) {
      if (json instanceof Array) {
        json.forEach(function(question, index) {
          // Don't add articles without images to the Facebook feed or Facebook
          // will reject *all* articles (*sigh*)
          if (!question.image || !question.image.url || question.image.url === '') {
            return
          }

          // Only add questions with answers to the feed!
          if ('acceptedAnswer' in question && 'text' in question.acceptedAnswer && question.acceptedAnswer.text !== '') {
            let url = 'https://upsum.news/questions/'+question['@id'].split('/')[4]
            let html = ''
            
            if (question.image && question.image.url && question.image.url !== '') {
              let fileName = question.image.url.split('/').pop()
              let imageUrl = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
              let imageCredit = 'Upsum'
              if ('publisher' in question.image &&
                  'name' in question.image.publisher &&
                  'url' in question.image.publisher) {
                imageCredit = question.image.publisher.name
              }

              html += `<figure><img src="${imageUrl}"/><figcaption class="op-vertical-below"><cite>${escapeHtml(imageCredit)}</cite></figcaption></figure>`
            }
            
            if ('text' in question && question.text !== '') {
              html += '<h2>' + escapeHtml(question.text) + '</h2>'
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