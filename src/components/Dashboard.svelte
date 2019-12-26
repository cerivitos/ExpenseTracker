<script>
  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  import { onMount } from "svelte";

  let db;

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

    db = firebase.firestore();
  });

  function showData() {
    db.collection("expenses")
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
      });
  }
</script>

<style type="text/postcss">
  .button {
    @apply bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
</style>

<div class="flex items-center justify-center h-screen bg-gray-200">
  <button class="button" on:click={() => showData()}>show data</button>
</div>
