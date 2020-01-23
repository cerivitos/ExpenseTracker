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
    themeIsBright
  } from "./store/store";
  import Toast from "./components/Toast.svelte";
  import Settings from "./components/Settings.svelte";
  import DetailPage from "./components/DetailPage.svelte";
  import Entry from "./components/Entry.svelte";
  import Search from "./components/Search.svelte";
  import { handleRouting } from "./util";
  import { firebaseConfig } from "./config";

  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.register("/service-worker.js");
  // }

  let signInError = false;
  let errorMsg = "";
  let app;

  onMount(() => {
    const firebaseConfig = firebaseConfig;

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

      if (theme === "bright") {
        themeIsBright.set(true);
      } else if (theme === "dark") {
        themeIsBright.set(false);
      }
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

<style lang="postcss">

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
</main>
