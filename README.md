![icon](https://github.com/cerivitos/ExpenseTracker/blob/master/src/assets/favicon-32x32.png)
Simple Expense Tracker
=============

<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus).png"/>|
<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus)%20(1).png"/>|
<img width="240" src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh__dashboard(iPhone%206_7_8%20Plus)%20(2).png"/>|
<img src="https://github.com/cerivitos/ExpenseTracker/blob/master/expensetracker.now.sh_(Laptop%20with%20MDPI%20screen).png"/>


## Features
- Made with [Svelte](https://svelte.dev)
- Installable PWA with service worker
- Responsive layout for mobile and desktop
- Firestore to store expense entries
- Firebase Storage for image attachments
- Ability to add current location as a description tag
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

### Changing app bar color in Android

Most of us would know that we can control the app bar color using the `<meta name="theme-color"/>` element attribute. However, what if the user can switch color themes and you want the app bar color to change dynamically?

Since I don't see this mentioned much, here is a [little trick courtesy of Gordon Lesti](https://gordonlesti.com/change-theme-color-via-javascript/).

Basically you can programatically update change `theme-color`

```bash
const metaTheme = document.querySelector("meta[name=theme-color]");
metaTheme.setAttribute("content", "#fdfdfd");
```

and Android will update your app bar color on the fly.

### Maskable icon in Android

There is support for maskable icons for PWAs installed on Android devices. In your `dist/manifest.json` you can specify the maskable icon using `"purpose": "maskable"`. Ensure that your icon design has sufficient gutter space so that your logo isn't cut off.

```bash
{
  ...
  "icons": [
    ...
    {
      "src": "/assets/maskable_icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
}
```

More details [here](https://web.dev/maskable-icon/).

### Cypress testing

Currently there are no tests written but Cypress is built in if required.


## License

MIT
