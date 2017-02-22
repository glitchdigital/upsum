import fetch from 'isomorphic-fetch'

export default class Questions {

  hostname() {
    return 'https://structured-data-api-nmxdgazjbk.now.sh'
  }
  
  async get(id) {
    const res = await fetch(this.hostname()+'/Question/'+id)
    const question = await res.json()

    // If not all properties are specified on an question,
    // add blank default values to make working with them easier
    if (!question['acceptedAnswer'])
      question['acceptedAnswer'] = { name: '', description: '', citation: '' }
    
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
      url += 'sort=-_updated'
    }

    if ("limit" in options && options.limit !== undefined)
      url += "&limit="+encodeURIComponent(options.limit)
      
    if ("name" in options && options.name !== undefined)
      url += "&name="+encodeURIComponent(options.name)
    
    const res = await fetch(url)
    const questions = await res.json()
    if (questions instanceof Array) {
      return questions
    } else {
      // @FIXME Something bad happened
      return []
    }
  }
  
}