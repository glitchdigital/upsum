'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const Sitemap = require('express-sitemap')
const NewsSitemap = require('./lib/news-sitemap')
const next = require('next')
const fetch = require('isomorphic-fetch')
const sass = require('node-sass')
const RSS = require('rss')
const marked = require('marked')
const ampl = require('ampl')
const routes = {
  images: require('./routes/images')
}

// Load environment variables from .env file if present
require('dotenv').load()

if (process.env.LOGS_SECRET) {
  require('now-logs')(process.env.LOGS_SECRET)
}

process.on('uncaughtException', function (err) {
  console.log(err)
})

process.env.NODE_ENV = process.env.NODE_ENV || "production"
process.env.PORT = process.env.PORT || 80

const app = next({
  dir: '.', 
  dev: (process.env.NODE_ENV == 'production') ? false : true
})
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  // Debug uncaughtException errors
  server.on('uncaughtException', function (req, res, route, err) {
    console.log(route)
    console.log(err)
    if (!res.headersSent) {
      return res.send(500, {ok: false})
    }
    res.write('\n')
    res.end()
  })
  
  // Handle data submission
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  
  // Improving caching behaviour across browsers
  server.use(function(req, res, next) {
    res.setHeader('Vary', 'Accept-Encoding')
    next()
  })

  // Add route to serve compiled SCSS from /assets/{build id}/main.css
  const sassResult = sass.renderSync({file: './css/main.scss'})
  server.get('/assets/:id/main.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css')
    res.setHeader("Cache-Control", "public, max-age=2592000")
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString())
    res.send(sassResult.css)
  })

  server.get('/questions/edit/:id', (req, res) => {
    if ("id" in req.params) {
      return app.render(req, res, '/question/edit', req.params)
    } else {
      return app.render(req, res, '/', req.params)
    }
  })

  server.get('/questions/:id', (req, res) => {
    if ("id" in req.params) {
      return app.render(req, res, '/question', req.params)
    } else {
      return app.render(req, res, '/', req.params)
    }
  })
  
  server.get('/questions', (req, res) => {
    return app.render(req, res, '/', req.params)
  })

  // Endpoint to search and upload images to the CDN
  // (middleware as the backend doesn't do this directly)
  server.get('/images', routes.images.get)
  server.post('/images', routes.images.post)

  server.get('/robots.txt', function(req, res) {
    res.send("Sitemap: https://upsum.news/sitemap.xml\n"+
             "Sitemap: https://upsum.news/news-sitemap.xml\n"+
             "User-agent: *\n"+
             "Disallow: /question/new\n"+
             "Disallow: /question/edit\n"+
             "Disallow: /questions/edit/*\n"+
             "Disallow: /signin\n")
  })
  
  server.get('/sitemap.xml', function(req, res) {
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
  })

  server.get('/news-sitemap.xml', function(req, res) {
    var newsSitemap = new NewsSitemap({
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
  })
  
  server.get('/rss.xml', function(req, res) {
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
  })

  // Render AMP pages
  server.get('/amp/questions/:id', function(req, res) {
    fetch('https://api.upsum.news/Question/'+req.params.id)
    .then(function(response) {
      response.json()
      .then(function(question) {
        let markdownString = '# '+question.name+'\n\n'

        if ('image' in question &&
            'url' in question.image &&
            question.image.url != '') {
          let fileName = question.image.url.split('/').pop()
          let imageURL = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
          markdownString += '!['+question.name+']('+imageURL+')\n\n'
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
          
        ampl.parse(markdownString, {style: 'body { margin: 0; padding: 20px; font-family: sans-serif;}'}, function(ampHtml) {
          res.send(ampHtml)
        })
      })
    })
    
  })
  

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(process.env.PORT , (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:'+process.env.PORT+" ["+process.env.NODE_ENV+"]")
  })
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  console.log(err)
})