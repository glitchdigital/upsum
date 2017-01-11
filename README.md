# Upsum

"The news, summed up"

News as Structured Data Q&A

## Getting started

The website use Node 6.x and the Next.js 2.0 framework (which uses React).

It uses `forever` to stop/start/restart in production (installed with `npm install forever -g`).

### Running locally

To run the server locally in development mode, with live reload enabled just install the modules and start it:

    npm install
    npm run dev
    
The web server will start at http://localhost:3000

In development mode, changes to pages and components will live update in the browser without reloading.

### Building and deploying the server in production

To install and run the service in production just install the modules, build and start it:

    npm install
    npm start
  
To stop the service use:

    npm stop
    
You can also restart the service:

    npm restart
    
In production, web server will start at http://localhost:80 (but the PORT argument can be set to override the default port).

In production mode, changes will not live reload.

Starting and restarting the service will trigger an 'build' step first, which can take a few seconds to complete.