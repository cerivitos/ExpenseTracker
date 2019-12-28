<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { toastMessage } from "../store/store";

  let db;

  onMount(() => {
    db = firebase.firestore();

    toastMessage.set("Updating...");

    db.collection("expenses")
      .get()
      .then(querySnapshot => {
        toastMessage.set("");
        console.log(querySnapshot);
      })
      .catch(err => {
        toastMessage.set(err);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  });
</script>

<style type="text/postcss">
  .button {
    @apply bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
</style>

<div class="flex flex-col mx-4 my-8" />
