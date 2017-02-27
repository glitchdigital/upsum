import fetch from 'isomorphic-fetch'
import { Session } from '../models/session'

export default class Images {

  hostname() {
    if (window.location.host === 'localhost:3000') {
      return 'http://'+window.location.host
    } else {
      return 'https://'+window.location.host
    }
  }

  async search(text) {
    if (text.trim() === '')
      return []
      
    const session = Session()
    const res = await fetch(this.hostname()+'/images?text='+encodeURIComponent(text.trim()), {
      method: 'GET',
      headers: {
        'x-api-key': session.getState().sessionId
      }
    })
    return await res.json()
  }

  async deployToCDN(imageUrl) {
    const session = Session()
    const res = await fetch(this.hostname()+'/images', {
      method: 'POST',
      headers: {
        'x-api-key': session.getState().sessionId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: imageUrl})
    })
    return await res.json()
  }
  
}