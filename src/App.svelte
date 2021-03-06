<script>
  import Dashboard from "./components/Dashboard.svelte";
  import Router from "./components/Router.svelte";
  import Scaffold from "./components/Scaffold.svelte";
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import { onMount } from "svelte";
  import {
    view,
    userInfo,
    overlay,
    detailData,
    themeIsBright,
    toastMessage
  } from "./store/store";
  import Toast from "./components/Toast.svelte";
  import Settings from "./components/Settings.svelte";
  import DetailPage from "./components/DetailPage.svelte";
  import Entry from "./components/Entry.svelte";
  import Search from "./components/Search.svelte";
  import { handleRouting } from "./util";
  import { firebaseConfig } from "./config";
  import { fly } from "svelte/transition";
  import { Workbox } from "workbox-window";

  let appUpdated = false;
  const wb = new Workbox("/service-worker.js");

  if ("serviceWorker" in navigator) {
    wb.addEventListener("controlling", ev => {
      window.location.reload();
      appUpdated = true;
    });
    wb.register();
  }

  let signInError = false;
  let errorMsg = "";
  let app;

  onMount(() => {
    app = firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        userInfo.set({
          name: user.displayName,
          photo: user.photoURL,
          uid: user.uid
        });
      }
    });

    //Set color theme
    if (localStorage.getItem("theme")) {
      const theme = localStorage.getItem("theme");

      document
        .getElementsByTagName("main")[0]
        .setAttribute("data-theme", theme);

      const metaTheme = document.querySelector("meta[name=theme-color]");

      if (theme === "bright") {
        themeIsBright.set(true);
        metaTheme.setAttribute("content", "#fdfdfd");
      } else if (theme === "dark") {
        themeIsBright.set(false);
        metaTheme.setAttribute("content", "#0E131C");
      }
    } else {
      localStorage.setItem("theme", "bright");
      themeIsBright.set(true);
      metaTheme.setAttribute("content", "#fdfdfd");
    }

    //Parse url to ui state on app load
    const page = window.location.search.substring(1);
    handleRouting(page);
    if (page === "dashboard" || page === "settings") {
      view.set(page);
      overlay.set("");
    } else if (page === "detail") {
      if (Object.keys($detailData).length > 0) {
        handleRouting("detail#" + $detailData.type);
        overlay.set("detail");
      } else {
        view.set("dashboard");
        overlay.set("");
      }
    } else if (page === "entry") {
      view.set("dashboard");
      overlay.set("entry");
    } else if (page === "search") {
      view.set("dashboard");
      overlay.set("search");
    } else {
      view.set("dashboard");
      overlay.set("");
    }
  });

  //Listen to back history events and parse url to ui state
  window.onpopstate = function(event) {
    const page = window.location.search.substring(1);
    handleRouting(page);
    if (page === "dashboard" || page === "settings") {
      view.set(page);
      overlay.set("");
    } else if (page === "detail") {
      if (Object.keys($detailData).length > 0) {
        handleRouting("detail#" + $detailData.type);
        overlay.set("detail");
      } else {
        view.set("dashboard");
        overlay.set("");
      }
    } else if (page === "entry") {
      view.set("dashboard");
      overlay.set("entry");
    } else if (page === "search") {
      view.set("dashboard");
      overlay.set("search");
    } else {
      view.set("dashboard");
      overlay.set("");
    }
  };
</script>

<style type="text/postcss">
  .update-message-wrapper {
    @apply absolute mb-12 w-full z-10;
    bottom: 56px;
  }

  .update-message {
    @apply mx-4 rounded flex items-center justify-between p-4 shadow;
    background-color: var(--inactive-button-color);
    color: var(--text-color2);
  }

  @media only screen and (min-width: 768px) {
    .update-message-wrapper {
      @apply flex justify-center;
      bottom: 0;
    }
    .update-message {
      @apply w-6/12;
    }
  }

  .update-button {
    @apply bg-transparent p-2;
    color: hsl(var(--accent-hue), 50%, 55%);
  }

  .update-button:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.2);
    transition: background-color 250ms ease-out;
  }

  .update-button:active {
    background-color: hsla(var(--secondary-hue), 30%, 75%, 0.4);
    transition: background-color 80ms ease-in;
  }
</style>

<main class="overflow-hidden" data-theme="dark">
  <Scaffold>
    {#if $view === 'settings'}
      <Settings />
    {:else if $view === 'dashboard' && app}
      <Dashboard />
    {/if}
  </Scaffold>
  {#if $overlay === 'detail'}
    <DetailPage />
  {:else if $overlay === 'entry'}
    <Entry />
  {:else if $overlay === 'search'}
    <Search />
  {/if}
  {#if signInError}
    <Toast message={errorMsg} />
  {/if}
  {#if appUpdated}
    <Toast message="App updating..." />
  {/if}
</main>
