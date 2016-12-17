/** 
 * The Session class should be invoked in the  getInitialProps() of every page,
 * any time a Session object is used to render a view page - even if in a 
 * component on the page (like the header) and not directly in the page itself.
 *
 * e.g.
 *
 *  getInitialProps({ req }) {
 *    const session = Session(req)
 *  }
 *
 * This is because components that are not pages don't have a getInitialProps()
 * method and have no way of inspecting headers to load cookies when code is
 * run server side - so the req object (which contains cookie information) must
 * be passed by the page to the session to initalise the cookie store.
 *
 */

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import cookie from 'react-cookie'

export const reducer = (session = { 
    name: '',
    email: '',
    sessionId: '',
    admin: false 
  }, action) => {
  switch (action.type) {
    case 'LOGIN':
      var expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 10);
      cookie.save('session', action.session, { path: '/', expires: expiryDate })
      return action.session
    case 'LOGOUT':
      cookie.remove('session', { path: '/' })
      return null
    default:
      return session
  }
}

export const Session = (req, res) => {
  // If request object passed, plugToRequest will parse cookie from header
  // when the code is run the server side
  var unplug = (req) ? cookie.plugToRequest(req) : null; 
  
  // Load session from cookie
  const storedSession = cookie.load('session')
  
  if (typeof window === 'undefined') {
    // If running on the server, instantiate the session on every page request
    return createStore(reducer, storedSession, applyMiddleware(thunkMiddleware))
  } else {
    // If in a browser, return the store from memory if there already is one
    if (!window.session)
      window.session = createStore(reducer, storedSession, applyMiddleware(thunkMiddleware))

    return window.session
  } 
}
