import 'isomorphic-fetch'

export default class Questions {

  async get(id) {
    let res = await fetch('http://localhost:3001/Question/'+id)
    let json = await res.json()
    return json
  }

  async create(options) {
    let res = await fetch('http://localhost:3001/Question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ''
      },
      body: JSON.stringify({
        name: 'Example question',
        text: 'Example answer',
      })
    })
    let json = await res.json()
    return json
  }

  async update(options) {
    
  }

  async delete(options) {
    
  }
  

  async search(options) {
    let res = await fetch('http://localhost:3001/Question/search')
    let json = await res.json()
    if (json instanceof Array) {
      return json
    } else {
      // @FIXME Something bad happened
      return []
    }
  }
  
}