const express = require('express')
const sitemap = require('express-sitemap')
const next = require('next')
const fetch = require('isomorphic-fetch')

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

  server.get('/sitemap.xml', function(req, res) {
    let sitemapOptions = {
      http: 'http',
      url: 'upsum.org',
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
    fetch("http://api.upsum.glitched.news/Question?sort=-_updated&limit=50")
    .then(function(response) {
      response.json()
      .then(function(json) {
        if (json instanceof Array) {
          json.forEach(function(question, index) {
            
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
          })
        }
        sitemap(sitemapOptions).XMLtoWeb(res)
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