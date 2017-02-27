'use strict'

require('dotenv').load()

const fs = require('fs')
const Flickr = require('flickrapi')
const cloudinary = require('cloudinary')
const request = require('request')

const flickrOptions = {
  api_key: process.env.FLICKR_KEY,
  secret:  process.env.FLICKR_SECRET
}

// We have whitelisted keys that can add images for now
// @TODO Migrate to a permissions check against the database
const upsumApiKeys = process.env.UPSUM_API_KEYS.split(',')

// Get images (with suitable re-use licences) from Flickr API
exports.get = (req, res, next) => {
  var apiKey = req.headers['x-api-key'] || null

  if (!apiKey)
    return res.status(403).json({ error: "Access denied - API Key required" })

  if (!upsumApiKeys.includes(apiKey))
    return res.status(403).json({ error: "Access denied - API Key invalid" })
  
  if (!('text' in req.query) || req.query.text.trim() === '')
    return res.status(400).json({ error: "'text' query parameter must not be blank" })
    
  Flickr.tokenOnly(flickrOptions, function(err, flickr) {
    if (err) {
      return res.status(500).json({ error: err })
    }

   /**
    * Flickr Licence options:
    *  0: All Rights Reserved
    *  1: Attribution-NonCommercial-ShareAlike
    *  2: Attribution-NonCommercial
    *  3: Attribution-NonCommercial-NoDerivs
    *  4: Attribution
    *  5: Attribution-ShareAlike
    *  6: Attribution-NoDerivs
    *  7: No known copyright restrictions
    *  8: US Government Work
    *  9: Public Domain Dedication (CC0)
    *  10: Public Domain Mark
    */

    flickr.photos.search({
      text: req.query.text,
      license: '4,5,7,9,10',
      extras: 'url_s,url_o,owner_name,media',
      per_page: 100,
      sort: 'relevance'
    }, function(err, result) {
      if (err) {
        return res.status(500).json({ error: err })
      }
  
      let photos = []
      result.photos.photo.forEach(photo => {
        if (photo.ispublic !== 1)
          return
        if (photo.media !== 'photo')
          return
        photos.push({
          owner: photo.ownername,
          description: photo.title,
          url: 'https://www.flickr.com/photo.gne?id='+photo.id,
          thumbnail: {
            src: photo.url_s,
            height: photo.height_s,
            width: photo.width_s
          },
          image: {
            src: photo.url_o,
            height: photo.height_o,
            width: photo.width_o
          }
        })
      })
      res.json(photos)
    })
  })
}

// Download images from URL and upload to CDN and return metadata
exports.post = (req, res, next) => {
  var apiKey = req.headers['x-api-key'] || null
  
  if (!apiKey)
    return res.status(403).json({ error: "Access denied - API Key required" })

  if (!upsumApiKeys.includes(apiKey))
    return res.status(403).json({ error: "Access denied - API Key invalid" })
  
  if (!('url' in req.body) || req.body.url === 'undefined' ||req.body.url.trim() === '')
    return res.status(400).json({ error: "'url' JSON property must not be blank" })

  try {
    let stream = cloudinary.uploader.upload_stream(function(result) { 
      res.json(result)
    })
  
    request(req.body.url).pipe(stream)
  } catch (err) {
    if (err) {
      return res.status(500).json({ error: err })
    }
  }
}
