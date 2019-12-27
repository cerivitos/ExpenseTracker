<script>
  import Dashboard from "./components/Dashboard.svelte";
  import Router from "./components/Router.svelte";
  import Scaffold from "./components/Scaffold.svelte";
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import { onMount } from "svelte";
  import { userInfo } from "./store/store";
  import Toast from "./components/Toast.svelte";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }

  let signInError = false;
  let errorMsg = "";

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

    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        userInfo.set(user);
      } else {
        signIn();
      }
    });
  });

  function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        const user = result.user;
        userInfo.set(user);
      })
      .catch(function(error) {
        console.error(error);
        signInError = true;
        errorMsg = error.message;
        setTimeout(() => (signInError = false), 3000);
      });
  }
</script>

<style lang="postcss">

</style>

<main class="overflow-hidden">
  <Router />
  <Scaffold />
  {#if signInError}
    <Toast message={errorMsg} />
  {/if}
</main>
