# Upsum

"The news, summed up"

Using structured journalism to deliver news as questions & qnswers.

## Getting started

The website use Node 7.x and the Next.js 2.0 framework, which uses React.

### Running locally

To run the server locally in development mode, with live reload enabled just install the modules and start it:

    npm install
    npm run dev
    
The web server will start at http://localhost:3000

In development mode, changes to pages, components and CSS will live update in the browser without reloading (you will still need to restart if you make changes to the root 'index.js').

### Running in production mode

To run the service in production mode just install the modules, build and start it:

    npm install
    npm run build
    npm start

You must incriment the version number in package.json and run npm build when deploying a new version.

### Deploying

Deploy to the cloud with `now` (`npm -g install now`):

    now
    
Once you have checked it has deployed okay, put it live on the production domain with:

    now alias