<script>
  import Dashboard from "./components/Dashboard.svelte";
  import Router from "./components/Router.svelte";
  import Scaffold from "./components/Scaffold.svelte";
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import { onMount } from "svelte";
  import { view, userInfo } from "./store/store";
  import Toast from "./components/Toast.svelte";
  import Settings from "./components/Settings.svelte";
  import PageScaffold from "./components/PageScaffold.svelte";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }

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
  });
</script>

<style lang="postcss">

</style>

<main class="overflow-hidden">
  <Router />
  <Scaffold>
    {#if $view === 'settings'}
      <Settings />
    {:else if $view === 'dashboard' && app}
      <Dashboard />
    {/if}
  </Scaffold>
  {#if $view === 'detail'}
    <PageScaffold />
  {/if}
  {#if signInError}
    <Toast message={errorMsg} />
  {/if}
</main>
