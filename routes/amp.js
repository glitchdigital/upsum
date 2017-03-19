'use strict'

const fetch = require('isomorphic-fetch')
const marked = require('marked')

exports.get = (req, res, next) => {
  fetch('https://api.upsum.news/Question/'+req.params.id)
  .then(function(response) {
    response.json()
    .then(function(question) {

      let imageHtml = ''
      if ('image' in question &&
          'url' in question.image &&
          question.image.url != '') {
        let fileName = question.image.url.split('/').pop()
        let imageURL = 'https://res.cloudinary.com/glitch-digital-limited/image/upload/h_512,w_1024,c_fill/'+fileName
        imageHtml = `<span itemProp="image" itemScope itemType="https://schema.org/ImageObject">
<amp-img class="image" width="1024" height="512" layout="responsive" src="${imageURL}" alt="${question.name}"/>
  <meta itemProp="url" content="${imageURL}"/><br/>
  <meta itemProp="height" content="512"/>
  <meta itemProp="width" content="1024"/>
</span>`
      }

      let articleHtml = ''
      
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

      if ('image' in question &&
          'publisher' in question.image &&
          'name' in question.image.publisher &&
          'url' in question.image.publisher) {
        articleHtml += marked('Image credit: ['+question.image.publisher.name +']('+question.image.publisher.url+')\n\n')
      }
    
      const ampHtml = `<!doctype html>
<html amp>
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="${'https://upsum.news/questions/' + req.params.id}">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      body {
        font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
        font-size: 18px; line-height: 28px;
        background: #eee;
        color: #444;
        margin: 0;
        padding: 0 20px; margin: 0;
      }
      h1 {margin: 0; font-size: 30px; line-height: 38px;}
      a {color: #444; font-weight: 500; text-decoration: none;}
      blockquote {color: #666; border-left: 2px solid #ddd; margin-left: 10px; padding-left: 20px; font-style: italic;}
      .content {max-width: 660px; margin: 0 auto;}
      .question-text {font-style: italic;}
      .metadata {display: none;}
      .image {margin-top: 20px;}
      .logo {
        margin-top: 25px;
        margin-bottom: 15px;
        overflow: auto;
      }
      .logo a {
        border: 0;
        color: #5c5c5c;
      }
      .logo .text {
        display: inline-block;
        text-align: left;
        float: left;
      }
      .logo .text h1 {
        margin: 0;
        padding: 0;
        font-size: 48px;
        line-height: 52px;
        position: relative;
        text-align: left;
      }
      .logo .text h1 a {
        font-weight: 600;
      }
      .logo .text p {
        margin: 0;
        padding: 0 0 0 2px;
      }
      .logo .text p a {
        text-transform: uppercase;
        font-weight: 400;
      }
      .logo img {
        height: 75px;
        width: 75px;
        border: 0;
      }
      .logo amp-img {
        float: left;
        margin-right: 2px;
      }
      .footer {
        text-align: right;
      }
    </style>
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
      ${imageHtml}
      <span itemProp="articleBody">${articleHtml}</span>
      <span class="metadata">
        <link itemProp="mainEntityOfPage" href="${'https://upsum.news/questions/' + req.params.id}"/><br/>
        <span itemProp="url">${'https://upsum.news/questions/' + req.params.id}</span><br/>
        <span itemProp="datePublished">${question['@dateCreated']}</span><br/>
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
        "account": "UA-92465819-2"
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