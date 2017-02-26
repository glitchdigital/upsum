const express = require('express')
const sitemap = require('express-sitemap')
const next = require('next')
const fetch = require('isomorphic-fetch')
const sass = require('node-sass')
const RSS = require('rss')
const marked = require('marked')

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
    res.redirect('/')
  })

  server.get('/robots.txt', function(req, res) {
    res.send("Sitemap: https://upsum.news/sitemap.xml\n"+
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
        '/': ['get']
      },
      route: {
        '/': {
          changefreq: 'daily',
          priority: 1.0
        }
      }
    }
    // Add 50 most recently updated questions to the sitemap
    fetch("https://api.upsum.news/Question?sort=-_created&limit=50")
    .then(function(response) {
      response.json()
      .then(function(json) {
        if (json instanceof Array) {
          json.forEach(function(question, index) {
            // Only add questions with answers to the sitemap!
            if ('acceptedAnswer' in question && 'text' in question.acceptedAnswer && question.acceptedAnswer.text !== '') {
              // Set homepage last modified date to that of last question modified
              if (index === 0)
                sitemapOptions.route['/'].lastmod = question['@dateModified'].split('T')[0]

              let route = "/questions/"+question['@id'].split('/')[4]
              sitemapOptions.map[route] = ['get']
              sitemapOptions.route[route] = {
                changefreq: 'weekly',
                lastmod: question['@dateModified'].split('T')[0],
                priority: 0.9
              }
            }
          })
        }
        sitemap(sitemapOptions).XMLtoWeb(res)
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
              let text = ''
              if ('text' in question && question.text !== '') {
                text += '<div style="font-style: oblique;">'+marked(question.text)+'</div>'
              }
              text += marked(question.acceptedAnswer.text)
              if ('citation' in question.acceptedAnswer && question.acceptedAnswer.citation !== '') {
                text += '<p><strong>Sources:</strong></p>'
                     +marked(question.acceptedAnswer.citation)
              }
              rssFeed.item({
                  title: question.name,
                  description: text,
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