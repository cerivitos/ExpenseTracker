<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";

  let db;

  onMount(() => {
    db = firebase.firestore();

    db.collection("expenses")
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot);
      });
  });
</script>

<style type="text/postcss">
  .button {
    @apply bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
</style>

<div class="flex items-center justify-center h-screen bg-gray-200" />
