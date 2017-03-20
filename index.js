'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const sass = require('node-sass')
const routes = {
  images: require('./routes/images'),
  amp: require('./routes/amp'),
  rss: require('./routes/rss'),
  rssFacebook: require('./routes/rss-facebook'),
  sitemap: require('./routes/sitemap'),
  newsSitemap: require('./routes/news-sitemap')
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
  
  // Redirect requestions to www.upsum.news to https://upsum.news/
  server.use(function (req, res, next) {
    if (req.hostname === "www.upsum.news") {
      res.redirect(301, 'https://upsum.news' + req.originalUrl)
    } else {
      next()
    }
  })
  
  // Improving caching behaviour across browsers
  server.use(function(req, res, next) {
    res.setHeader('Vary', 'Accept-Encoding')
    next()
  })

  // Add route to serve compiled SCSS from /assets/{build id}/main.css
  const sassResult = sass.renderSync({file: './css/main.scss', outputStyle: 'compressed'})
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

  server.get('/questions/new', (req, res) => {
    return app.render(req, res, '/question/new', req.params)
  })
  
  server.get('/questions/:id', (req, res) => {
    if ("id" in req.params) {
      return app.render(req, res, '/question', req.params)
    } else {
      return app.render(req, res, '/', req.params)
    }
  })

  server.get('/questions', (req, res) => {
    return app.render(req, res, '/')
  })

  // Endpoint to search and upload images to the CDN
  // (middleware as the backend doesn't do this directly)
  server.get('/images', routes.images.get)
  server.post('/images', routes.images.post)

  // Serve AMP version of questions
  server.get('/amp/questions/:id', routes.amp.get)

  // Serve recent questions as an RSS feeed
  server.get('/rss.xml', routes.rss.get)

  // Serve recent questions as an RSS feeed
  server.get('/rss-facebook.xml', routes.rssFacebook.get)

  // Serve sitemap (and news specific sitemap)
  server.get('/sitemap.xml', routes.sitemap.get)
  server.get('/news-sitemap.xml', routes.newsSitemap.get)

  // Define robots.txt to tell search engines what they should & shouldn't index
  server.get('/robots.txt', function(req, res) {
    res.send("Sitemap: https://upsum.news/sitemap.xml\n"+
             "Sitemap: https://upsum.news/news-sitemap.xml\n"+
             "User-agent: *\n"+
             "Disallow: /question/new\n"+
             "Disallow: /questions/new\n"+
             "Disallow: /question/edit\n"+
             "Disallow: /questions/edit/*\n"+
             "Disallow: /signin\n")
  })

  // Default request handler (passes through to next.js)
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