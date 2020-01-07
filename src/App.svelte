<script>
  import Dashboard from "./components/Dashboard.svelte";
  import Router from "./components/Router.svelte";
  import Scaffold from "./components/Scaffold.svelte";
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import { onMount } from "svelte";
  import { view, userInfo, overlay, detailData } from "./store/store";
  import Toast from "./components/Toast.svelte";
  import Settings from "./components/Settings.svelte";
  import DetailPage from "./components/DetailPage.svelte";
  import Entry from "./components/Entry.svelte";
  import { handleRouting } from "./util";

  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.register("/service-worker.js");
  // }

  let signInError = false;
  let errorMsg = "";
  let app;

  onMount(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyAK19fHNBTzkPjyM5CZRMyR1H5LyJ8R69E",
      authDomain: "expensetracker-fe56d.firebaseapp.com",
      databaseURL: "https://expensetracker-fe56d.firebaseio.com",
      projectId: "expensetracker-fe56d",
      storageBucket: "expensetracker-fe56d.appspot.com",
      messagingSenderId: "680552838328",
      appId: "1:680552838328:web:d7d7ef47348fbb3920f04d"
    };

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
      view.set("dashboard");
      overlay.set("");
    } else if (page === "entry") {
      view.set("dashboard");
      overlay.set("entry");
    } else {
      view.set("dashboard");
      overlay.set("");
    }
  };
</script>

<style lang="postcss">

</style>

<main class="overflow-hidden">
  <Scaffold>
    {#if $view === 'settings'}
      <Settings />
    {:else if $view === 'dashboard' && app}
      <Dashboard />
    {/if}
  </Scaffold>
  {#if $overlay === 'detail'}
    <DetailPage />
  {/if}
  {#if signInError}
    <Toast message={errorMsg} />
  {/if}
  {#if $overlay === 'entry'}
    <div>
      <Entry />
    </div>
  {/if}
</main>
