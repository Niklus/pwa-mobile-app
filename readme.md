# Progressive Web App

### [LIVE LINK](https://pwa-mobile-app-c6f33.firebaseapp.com)
Simple PWA mobile app built with [stencil](https://stenciljs.com/).

## Running the App
Run:
```bash
yarn
yarn start
```
To view the build, start an HTTP server inside of the `/www` directory.
To watch for file changes during develop, run:
```bash
yarn start
```
To build the app for production, run:
```bash
yarn build
```
For the build to create a service-worker in the dist folder you need to install the workbox cli
```bash
npm install -g workbox-cli
```
## Todos

* Give the user an option to bookmark articles.
* Automatically delete outdated articles from the database after a certain period of time.

