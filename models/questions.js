import fetch from 'isomorphic-fetch'

export default class Questions {

  hostname() {
    return 'http://api.upsum.glitched.news'
  }
  
  async get(id) {
    const res = await fetch(this.hostname()+'/Question/'+id)
    const json = await res.json()
    return json
  }

  async create(question, apiKey) {
    const res = await fetch(this.hostname()+'/Question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(question)
    })
    const json = await res.json()
    return json
  }

  async update(question, apiKey) {
    const id = question['@id'].split('/')[4]
    const res = await fetch(this.hostname()+'/Question/'+id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(question)
    })
    return res
  }

  async delete(id, apiKey) {
    const res = await fetch(this.hostname()+'/Question/'+id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    })
    return res
  }

  async search(options) {
    var url = this.hostname()+'/Question/?'

    if ("sort" in options) {
      url += "sort="+encodeURIComponent(options.sort)
    } else {
      url += 'sort=-_updated'
    }

    if ("limit" in options)
      url += "&limit="+encodeURIComponent(options.limit)
      
    if ("name" in options) {
      url += "&name="+encodeURIComponent(options.name.replace(/s /gi, " ").replace(/s$/i, ""))
    }
        
    const res = await fetch(url)
    const json = await res.json()
    if (json instanceof Array) {
      return json
    } else {
      // @FIXME Something bad happened
      return []
    }
  }
  
}