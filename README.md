![icon](https://github.com/cerivitos/ExpenseTracker/blob/master/src/assets/favicon-32x32.png)
Simple Expense Tracker made with Svelte
=============

<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus).png"/>|
<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus)%20(1).png"/>|
<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus)%20(2).png"/>|
<img src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh_(Laptop%20with%20MDPI%20screen).png"/>

## Features
- Installable PWA with service worker
- Responsive layout for mobile and desktop
- Firestore cloud storage
- Firebase authentication using Google sign in
- Dark mode

## Getting started

Create your own Firebase project following the instructions [here](https://firebase.google.com/docs/web/setup/).

Copy your own Firebase config object

```bash
var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};
```

and replace it [here](https://github.com/cerivitos/ExpenseTracker/blob/master/src/config.js).

Make sure [Node.js](https://nodejs.org) is installed. Clone the repo and

```bash
npm install
```

Start by

```bash
npm run dev
```

and go to [localhost:5000](http://localhost:5000).

Build for production using

```bash
npm run build
```

and serve the `dist` folder.

## Details

### Service Worker

[Workbox](https://developers.google.com/web/tools/workbox) is set up to automatically generate the service worker file in the `dist` folder using the `rollup-plugin-workbox` plugin.

Note that we are using the Rollup bundler hence the relevant docs are [here](https://developers.google.com/web/tools/workbox/guides/using-bundlers). The `rollup-plugin-workbox` plugin can be configured in [rollup.config.js](https://github.com/cerivitos/ExpenseTracker/blob/master/rollup.config.js).

### Now integration

The [Now hosting service](https://zeit.co/now) is a convenient way to host the app. You can use theire built-in [integrations with Git](https://zeit.co/docs/v2/git-integrations) to automatically stage your app with each push to your repo.

### Cypress testing

Currently there are no tests written but Cypress is built in if required.

## License

MIT
