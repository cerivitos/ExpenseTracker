<script>
  import { userInfo } from "../store/store";
  import firebase from "firebase/app";
  import "firebase/auth";
  import { fade } from "svelte/transition";

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        userInfo.set({});
      });
  }

  function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        const user = result.user;
        userInfo.set({
          name: user.displayName,
          photo: user.photoURL,
          uid: user.uid
        });
      })
      .catch(function(error) {
        console.error(error);

        userInfo.set({});
        signInError = true;
        errorMsg = error.message;
        setTimeout(() => (signInError = false), 3000);
      });
  }
</script>

<div class="flex flex-col mx-4 my-8" transition:fade={{ duration: 90 }}>
  {#if Object.keys($userInfo).length === 0}
    <button
      class="flex bg-white rounded shadow text-gray-700 py-2 px-4 font-bold
      justify-center w-1/2 md: w-full"
      on:click={() => signIn()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 48 48"
        class="w-6 h-6 pr-2">
        <defs>
          <path
            id="a"
            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2
            0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1
            29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22
            0-1.3-.2-2.7-.5-4z" />
        </defs>
        <clipPath id="b">
          <use xlink:href="#a" overflow="visible" />
        </clipPath>
        <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
        <path
          clip-path="url(#b)"
          fill="#EA4335"
          d="M0 11l17 13 7-6.1L48 14V0H0z" />
        <path
          clip-path="url(#b)"
          fill="#34A853"
          d="M0 37l30-23 7.9 1L48 0v48H0z" />
        <path clip-path="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
      </svg>
      <span>Sign in with Google</span>
    </button>
  {:else}
    <div class="flex flex-row items-center">
      <img
        src={$userInfo.photo}
        alt="User photo"
        class="rounded-full w-8 h-8 mr-4" />
      <span class="text-xl font-bold">{$userInfo.name}</span>
      <div class="flex-grow text-right">
        <button
          class="bg-gray-200 text-gray-700 rounded-full px-2 py-1"
          on:click={() => signOut()}>
          Sign out
        </button>
      </div>
    </div>
  {/if}
  <div class="w-full text-center my-8 flex flex-row justify-center">
    <a href="/privacy-policy.html" target="_blank" class="mr-2">
      Privacy policy
    </a>
    •
    <span class="text-center mb-8 ml-2">v0.1</span>
  </div>
</div>
