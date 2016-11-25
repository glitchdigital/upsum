import React from 'react'
import Link from 'next/link'

export default() => (
  <footer>
    <div className="container">
      <div className="row">
        <div className="twelve columns">
          <hr/>
          <p>&copy; <Link href="/">Upsum</Link> {new Date().getYear() + 1900}</p>
        </div>
      </div>
    </div>
  </footer>
)