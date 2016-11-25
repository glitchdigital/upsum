import 'isomorphic-fetch'
export default class Questions {
  
  async search(options) {
    let res = await fetch('http://localhost:3001/Question/search')
    let response = await res.json()
    if (response instanceof Array) {
      return response;
    } else {
      // @FIXME Something bad happened
      return [];
    }
  }
  
}