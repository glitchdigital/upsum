'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')
const moment = require('moment')
const sass = require('node-sass')

const css = sass.renderSync({file: './css/amp.scss', outputStyle: 'compressed'}).css

exports.get = (req, res, next) => {
  fetch('https://api.upsum.news/Question/'+req.params.id)
  .then(function(response) {
    response.json()
    .then(function(question) {

      let articleHtml = ''
      
      let trackingCode = 'UA-92465819-2'
      let imageURL = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_256,w_512,c_fill/upsum-publisher-logo_e6x61w.png'
      let imageHeight = '256'
      let imageWidth = '512'
      let imageContainerClass = 'image-container-hidden'
      let imageCreditName = 'Upsum'
      let imageCreditUrl = 'Upsum'
      
      if ('image' in question &&
          'url' in question.image &&
          question.image.url != '') {
        let fileName = question.image.url.split('/').pop()
            
        imageURL = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
        imageHeight = '512'
        imageWidth= '1024'
        imageContainerClass = 'image-container'
        
        if ('publisher' in question.image && 'name' in question.image.publisher) {
          imageCreditName = question.image.publisher.name
        }
        if ('publisher' in question.image && 'url' in question.image.publisher) {
          imageCreditUrl = question.image.publisher.url
        }
      }
      
      if ('text' in question && question.text !== '') {
        articleHtml += '<div class="question-text">'+marked(question.text)+'</div>'
      }
      
      if ('acceptedAnswer' in question &&
          'text' in question.acceptedAnswer &&
          question.acceptedAnswer.text !== '') {
        articleHtml += marked(question.acceptedAnswer.text)
      }
      
      if ('acceptedAnswer' in question &&
          'citation' in question.acceptedAnswer
          && question.acceptedAnswer.citation !== '') {
        articleHtml += '<p><strong>Sources:</strong></p>'+
                       marked(question.acceptedAnswer.citation)
      }

      let datePublished = question['@dateModified']
      if ('acceptedAnswer' in question
          && 'datePublished' in question.acceptedAnswer
          && question.acceptedAnswer.datePublished !== '') {
        datePublished = question.acceptedAnswer.datePublished
      }

      const ampHtml = `<!doctype html>
<html amp>
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="${'https://upsum.news/questions/' + req.params.id}"/>
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>${css}</style>
    <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <title>${question.name}</title>
  </head>
  <body>
    <div class="content" itemScope itemType="http://schema.org/NewsArticle">
      <div class="logo">
        <a href="https://upsum.news"><amp-img height="75" width="75" src="https://res.cloudinary.com/glitch-digital-limited/image/upload/h_150,w_150/v1489885960/upsum-publisher-logo_e6x61w.png" alt="Upsum - The news, summed up"/></a>
        <div class="text">
          <h1><a href="https://upsum.news">Upsum</a></h1>
          <p><a href="https://upsum.news">The news, summed up</a></p>
        </div>
      </div>
      <h1 itemProp="headline">${question.name}</h1>
      <p class="timestamp" itemProp="datePublished"> ${moment(datePublished).format('D MMMM, YYYY')}</p>
      <div class=${imageContainerClass}>
        <div itemProp="image" itemScope itemType="https://schema.org/ImageObject">
          <amp-img height="${imageHeight}" width="${imageWidth}" layout="responsive" attribution="${imageCreditName}" src="${imageURL}" alt="${question.name}"/>
          <meta itemProp="url" content="${imageURL}"/><br/>
          <meta itemProp="height" content="${imageHeight}"/>
          <meta itemProp="width" content="${imageWidth}"/>
        </div>
        <p class="image-credit">Image credit: <a href="${imageCreditUrl}">${imageCreditName}</a></p>
      </div>
      <span class="article-body" itemProp="articleBody">${articleHtml}</span>
      <span class="metadata">
        <link itemProp="mainEntityOfPage" href="${'https://upsum.news/questions/' + req.params.id}"/><br/>
        <span itemProp="url">${'https://upsum.news/questions/' + req.params.id}</span><br/>
        <span itemProp="dateCreated">${question['@dateCreated']}</span><br/>
        <span itemProp="dateModified">${question['@dateModified']}</span><br/>
        <span itemProp="author" itemScope itemType="https://schema.org/Organization"><br/>
          <span itemProp="name">Upsum</span><br/>
        </span>
        <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
          <span itemProp="name">Upsum</span><br/>
          <span itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
            <meta itemProp="url" content="https://upsum.news/static/images/upsum-publisher-logo.png"/><br/>
            <meta itemProp="height" content="537"/>
            <meta itemProp="width" content="537"/>
          </span>
        </span>
      </span>
      <p class="footer"><a href="https://upsum.news">Read more at upsum.news</a></p>
    </div>
  </body>
  <amp-analytics type="googleanalytics">
    <script type="application/json">
    {
      "vars": {
        "account": "${trackingCode}"
      },
      "triggers": {
        "trackPageview": {
          "on": "visible",
          "request": "pageview"
        }
      }
    }
    </script>
  </amp-analytics>
</html>`
      
      res.send(ampHtml)
    })
  })  
}