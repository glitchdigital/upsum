import fetch from 'isomorphic-fetch'

export default class Questions {

  async get(id) {
    const res = await fetch('http://localhost:3001/Question/'+id)
    const json = await res.json()
    return json
  }

  async create(question, apiKey) {
    const res = await fetch('http://localhost:3001/Question', {
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
    const res = await fetch('http://localhost:3001/Question/'+id, {
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
    const res = await fetch('http://localhost:3001/Question/'+id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    })
    return res
  }

  async search(options) {
    const res = await fetch('http://localhost:3001/Question/search')
    const json = await res.json()
    if (json instanceof Array) {
      return json
    } else {
      // @FIXME Something bad happened
      return []
    }
  }
  
}