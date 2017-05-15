'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const sass = require('node-sass')
const loggly = require('loggly')
const cron = require('node-cron')
const fetch = require('isomorphic-fetch')

const routes = {
  images: require('./routes/images'),
  amp: require('./routes/amp'),
  rss: require('./routes/rss'),
  rssEmail: require('./routes/rss-email'),
  rssFacebook: require('./routes/rss-facebook'),
  sitemap: require('./routes/sitemap'),
  newsSitemap: require('./routes/news-sitemap')
}

// Load environment variables from .env file if present
require('dotenv').load()

process.env.NODE_ENV = process.env.NODE_ENV || "production"
process.env.PORT = process.env.PORT || 80

if (process.env.LOGS_SECRET) {
  require('now-logs')(process.env.LOGS_SECRET)
}

const logger = new function() {
  this.log =  function(err, tags) { console.log(err, tags) }
  return this
}

/*
const logger = loggly.createClient({
  token: process.env.LOGGLY_TOKEN || '',
  subdomain: process.env.LOGGLY_SUBDOMAIN || '',
  auth: {
    username: process.env.LOGGLY_USERNAME || '',
    password: process.env.LOGGLY_PASSWORD || ''
  },
  tags: ['upsum.news', process.env.NODE_ENV]
})
*/

logger.log("Instance intialized", ['startup'])

process.on('uncaughtException', function (err) {
  console.log(err)
  logger.log(err, ['process','uncaughtException'])
})

const app = next({
  dir: '.', 
  dev: (process.env.NODE_ENV == 'production') ? false : true
})
const handle = app.getRequestHandler()

let trendingQuestions = []

app.prepare()
.then(() => {
  const server = express()

  // Debug uncaughtException errors
  server.on('uncaughtException', function (req, res, route, err) {
    console.log(route)
    console.log(err)
    logger.log({ req: req, res: res, route: route, err: err }, ['express','uncaughtException'])
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

  server.get('/topic/:topic', (req, res) => {
    if ("topic" in req.params) {
      return app.render(req, res, '/topic', req.params)
    } else {
      return app.render(req, res, '/', req.params)
    }
  })

  server.get('/trending-questions', (req, res) => {
    return res.send(trendingQuestions)
  })
  
  // Endpoint to search and upload images to the CDN
  // (middleware as the backend doesn't do this directly)
  server.get('/images', routes.images.get)
  server.post('/images', routes.images.post)

  // Serve AMP version of questions
  server.get('/amp/questions/:id', routes.amp.get)

  // Serve recent questions as RSS feeeds
  server.get('/rss.xml', routes.rss.get)
  server.get('/rss-email.xml', routes.rssEmail.get)
  server.get('/rss-facebook.xml', routes.rssFacebook.get)

  // Serve sitemap (and news specific sitemap)
  server.get('/sitemap.xml', routes.sitemap.get)
  server.get('/news-sitemap.xml', routes.newsSitemap.get)

  // Email subscription link
  server.get('/email', (req, res) => {
    return res.redirect(301, 'https://news.us15.list-manage1.com/subscribe?u=90920d6af43c4d73f91ca0878&id=3f929585fa')
  })

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

  // After startup & every 5 minutes after, update cached trending questions
  updateTrendingQuestions()
  cron.schedule('*/2 * * * *', function(){
    updateTrendingQuestions()
  })

  server.listen(process.env.PORT, (err) => {
    if (err) throw err
    require('dns').lookup(require('os').hostname(), function(err, ipAddress, fam) {
      console.log('Server running at http://%s:%d in %s mode', ipAddress, process.env.PORT, process.env.NODE_ENV)
      logger.log('Instance started at http://'+ipAddress+':'+process.env.PORT+' in '+process.env.NODE_ENV+' mode', ['startup'])
      
    })
  })
})
.catch(err => {
  console.log('An error occurred, unable to start the server')
  logger.log("Instance failed to start", ['startup'])
  console.log(err)
})

function updateTrendingQuestions() {
  fetch('https://api.upsum.news/Question?sort=-_created&limit=64')
  .then(function(response) {
    response.json()
    .then(function(json) {
      trendingQuestions = json
    })
  })
}