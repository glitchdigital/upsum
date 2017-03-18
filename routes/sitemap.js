'use strict'

const fetch = require('isomorphic-fetch')
const Sitemap = require('express-sitemap')

exports.get = (req, res, next) => {
  let sitemapOptions = {
    http: 'https',
    url: 'upsum.news',
    map: {
      '/': ['get'],
      '/about': ['get'],
      '/daily': ['get']
    },
    route: {
      '/': {
        changefreq: 'daily',
        priority: 1.0
      },
      '/about': {
        changefreq: 'weekly',
        priority: 0.5
      },
      '/daily': {
        changefreq: 'daily',
        priority: 0.9
      }
    }
  }
  // Add 500 most recently updated questions to the sitemap
  fetch("https://api.upsum.news/Question?sort=-_created&limit=500")
  .then(function(response) {
    response.json()
    .then(function(json) {
      if (json instanceof Array) {
        json.forEach(function(question, index) {
          // Only add questions with answers to the sitemap!
          if ('acceptedAnswer' in question && 'text' in question.acceptedAnswer && question.acceptedAnswer.text !== '') {
            // Set homepage last modified date to that of last question modified
            if (index === 0) {
              sitemapOptions.route['/'].lastmod = question['@dateModified'].split('T')[0]
              sitemapOptions.route['/daily'].lastmod = question['@dateModified'].split('T')[0]
            }

            let route = "/questions/"+question['@id'].split('/')[4]
            sitemapOptions.map[route] = ['get']
            sitemapOptions.route[route] = {
              changefreq: 'weekly',
              lastmod: question['@dateModified'].split('T')[0],
              priority: 1.0
            }
          }
        })
      }
      Sitemap(sitemapOptions).XMLtoWeb(res)
    })
  })
}