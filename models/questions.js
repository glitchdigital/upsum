import fetch from 'isomorphic-fetch'

// @FIXME Refactor all the things! \o/
export default class Questions {

  hostname() {
    return 'https://api.upsum.news'
  }
  
  async get(id) {
    try {
      const res = await fetch(this.hostname()+'/Question/'+id)
      const question = await res.json()

      // If not all properties are specified on an question,
      // add blank default values to make working with them easier
      if (!question['acceptedAnswer'])
        question['acceptedAnswer'] = { name: '', description: '', citation: '' }
    
      if (!question.acceptedAnswer.datePublished)
        question.acceptedAnswer.datePublished = question['@dateModified']
    
      if (!question['image'])
        question['image'] = {}
    
      if (!question['image'].publisher)
        question['image'].publisher = {}

      if (!question['video'])
        question['video'] = {}
    
      if (!question['video'].publisher)
        question['video'].publisher = {}

      // @FIXME Check res to see if successful
      return question
    } catch (e) {
      // @FIXME Something bad happened
      return null
    }
  }

  async create(question, apiKey) {
    if (!question.dateCreated) question.dateCreated = Date.now()
    const res = await fetch(this.hostname()+'/Question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(question)
    })
    // @FIXME Check res to see if successful
    return await res.json()
  }

  async update(question, apiKey) {
    if (!question.dateModified) question.dateModified = Date.now()
    const id = question['@id'].split('/')[4]
    const res = await fetch(this.hostname()+'/Question/'+id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(question)
    })
    // @FIXME Check res to see if successful
    return await this.get(id)
  }

  async delete(id, apiKey) {
    const res = await fetch(this.hostname()+'/Question/'+id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    })
    // @FIXME Check res to see if successful
    return true
  }

  async search(options) {
    var url = this.hostname()+'/Question/?'

    if ("sort" in options && options.sort !== undefined) {
      url += "sort="+encodeURIComponent(options.sort)
    } else {
      url += 'sort=-_created'
    }

    if ("limit" in options && options.limit !== undefined)
      url += "&limit="+encodeURIComponent(options.limit)
      
    if ("name" in options && options.name !== undefined)
      url += "&name="+encodeURIComponent(options.name.replace(/[^0-9a-z_ -]/gi, ''))

    if ("text" in options && options.text !== undefined)
      url += "&text="+encodeURIComponent(options.text.replace(/[^0-9a-z_ -]/gi, ''))
      
    let result = []
    try {
      const res = await fetch(url)
      result = await res.json()
    } catch (e) {
      // @FIXME Something bad happened
    }
    return result
  }

  async getQuestionsFromUrl(url) {
    const res = await fetch(url)
    let result = []
    try {
      result = await res.json()
    } catch (e) {
      // @FIXME Something bad happened
    }
    return result
  }
}