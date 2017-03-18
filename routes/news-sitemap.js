'use strict'

const fetch = require('isomorphic-fetch')

exports.get = (req, res, next) => {
  var newsSitemap = new GoogleNewsSitemap({
    publication_name: 'Upsum',
    publication_language: 'en'
  })

  // Add 500 most recently updated questions to the news sitemap
  fetch("https://api.upsum.news/Question?sort=-_created&limit=500")
  .then(function(response) {
    response.json()
    .then(function(json) {
      if (json instanceof Array) {
        json.forEach(function(question, index) {
          // Only add questions with answers to the sitemap!
          if ('acceptedAnswer' in question && 'text' in question.acceptedAnswer && question.acceptedAnswer.text !== '') {
            newsSitemap.item({
                location: 'https://upsum.news/questions/'+question['@id'].split('/')[4],
                title: question.name,
                publication_date: question['@dateCreated']
            })
          }
        })
      }
      res.send(newsSitemap.xml())
    })
  })
}

/**
 * Based on https://github.com/iantocristian/node-gnews-sitemap/
 * By Cristian Ianto <iantocristian@yahoo.com>
 * Used under license http://github.com/iantocristian/node-gnews-sitemap/raw/master/LICENSE
 */
const XML = require('xml')

function GoogleNewsSitemap(options, items) {
  options = options || {}

  this.publication_name       = options.publication_name || 'Untitled News'
  this.publication_language   = options.publication_language || 'en'
  this.access                 = options.access
  this.genres                 = options.genres
  this.items                  = items || []

  this.item = function (options) {
    options = options || {}
    const item = {
      location:             options.location,
      publication_name:     options.publication_name || this.publication_name,
      publication_language: options.publication_language || this.publication_language,
      access:               options.access || this.access,
      genres:               options.genres || this.genres,
      publication_date:     options.publication_date,
      title:                options.title,
      geo_locations:        options.geo_locations,
      keywords:             options.keywords,
      stock_tickers:        options.stock_tickers
    }

    this.items.push(item)
    return this
  }

  this.xml = function(indent) {
    return '<?xml version="1.0" encoding="UTF-8"?>\n'
        + XML(generateXML(this), indent)
  }

}

function generateXML(data){

  const urlset = [
    { _attr: {
      'xmlns':     'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:news':  'http://www.google.com/schemas/sitemap-news/0.9'
       } }
    ]

    
  data.items.forEach(function(item) {
      const news_values = [
        { 'news:publication': [
          { 'news:name': item.publication_name },
          { 'news:language': item.publication_language }
        ] }
      ]
      if (item.access) news_values.push( { 'news:access': item.access } )
      if (item.genres) news_values.push( { 'news:genres': item.genres } )
      if (item.publication_date) news_values.push( { 'news:publication_date': item.publication_date } )
      if (item.title) news_values.push( { 'news:title': item.title } )
      if (item.geo_locations) news_values.push( { 'news:geo_locations': item.geo_locations } )
      if (item.keywords) news_values.push( { 'news:keywords': item.keywords } )
      if (item.stock_tickers) news_values.push( { 'news:stock_tickers': item.stock_tickers } )

      const url_values = [
        { _attr: {} },
        { 'loc': item.location },
        { 'news:news': news_values }
      ]

      urlset.push({ url: url_values })
  })
    
  return { urlset : urlset }
}