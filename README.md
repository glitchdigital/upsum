# Upsum

"The news, summed up"

News as Structured Data Q&A

## Getting started

The website use Node 6.x and the Next.js framework (wich uses React).

It is currently using the Next.js 2.0 Beta, so we don't have to be dependant on a seperate Varnish server to handle routing.

### Running locally

To run the server locally in development mode, with live reload enabled just install the modules and start it:

    npm install
    npm start
    
The web server will start at http://localhost:3000

In development mode, changes in the code will live reload in the browser.

### Building and deploying the server in production

To install and run the service in production just install the modules, build and start it:

    npm install
    npm run build
    NODE_ENV=production nohup npm start &
    
In production, web server will start at http://localhost:80 (but the PORT argument can be set to override the default port).

In production mode, changes will not live reload and the `npm run build` step will need to be run every time new code is deployed.