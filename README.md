# Upsum

"The news, summed up"

News as Structured Data Q&A

## Getting started

The website use Node 6.x and the Next.js 2.0 framework (which uses React).

### Running locally

To run the server locally in development mode, with live reload enabled just install the modules and start it:

    npm install
    npm run dev
    
The web server will start at http://localhost:3000

In development mode, changes to pages and components will live update in the browser without reloading.

### Building and deploying in production

To install and run the service in production mode just install the modules, build and start it:

    npm install
    npm run build
    npm start

You must incriment the version number in package.json and run npm build when deploying a new version.

Actual production is to an AWS Elastic Beanstalk auto-scaling cluster, which handles installing modules and building automaticall - just be sure to increment the version in package.json when deploying new build.