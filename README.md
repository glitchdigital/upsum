# Upsum

## Getting started

### Varnish 4.x and Node 6.x

The website uses Varnish 4.x and Node 6.x.

We are using Varnish as a cache and as a way to handle URL writes and to have prettier URLs than Next.js router currently allows for.

e.g. /question/foo-bar is passed to the Next.js app as /question?q=foo-bar

You can install both varnish and node with standard package managers such as `brew` (on Mac OS), `apt/dpkg` (on Debian/Ubuntu) and 'yum/rpm' (on RedHat).

### Running locally

If you use brew to install varnish on MacOS, and want to run it locally, you can start it it on port 8080 with:

    /usr/local/sbin/varnishd -F -f varnish.conf -a 0.0.0.0:8080

To start the server locally in development mode, with live reload enabled just install the modules and call the 'dev' run script:

    npm install
    npm run dev
    
Once both Varnish and the server are running to go http://localhost:8080

### Building and deploying the server in production

When deploying on a new server, copy the the `varnish.conf` file to the appropriate place for your operating system (e.g. `/etc/default/varnish` on Debian, `/etc/sysconfig/varnish` on RedHat and `/etc/varnish` on other systems) and be sure to set Varnish to run at startup.

To install and start the service in production just install the modules, build and run:

    npm install
    npm run build
    npm start