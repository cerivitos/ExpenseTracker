<script>
  import {
    userInfo,
    themeIsBright,
    toastMessage,
    view,
    dashboardShouldReload
  } from "../store/store";
  import firebase from "firebase/app";
  import "firebase/auth";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { handleRouting } from "../util";

  let selectedTheme = "bright";

  onMount(() => {
    if (localStorage.getItem("theme")) {
      selectedTheme = localStorage.getItem("theme");
    }
  });

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
        toastMessage.set(error.message);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  function switchTheme(theme) {
    document.getElementsByTagName("main")[0].setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    selectedTheme = theme;

    if (theme === "bright") {
      themeIsBright.set(true);
    } else if (theme === "dark") {
      themeIsBright.set(false);
    }
  }
</script>

<style type="text/postcss">
  .sign-out-button {
    @apply py-2 text-red-600 rounded-full px-4;
    background-color: transparent;
    transition: background-color 250ms ease-out;
  }

  .sign-out-button:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.2);
    transition: background-color 250ms ease-out;
  }

  .sign-out-button:active {
    background-color: hsla(var(--secondary-hue), 30%, 75%, 0.4);
    transition: background-color 80ms ease-in;
  }

  .name {
    @apply text-xl font-bold;
  }

  .label {
    @apply text-lg;
  }

  .theme-button {
    @apply cursor-pointer rounded-full w-8 h-8;
    -webkit-tap-highlight-color: transparent;
  }

  .theme-button:not(:last-child) {
    @apply mr-2;
  }

  .selected-theme {
    border: 4px solid hsl(var(--primary-hue), 50%, 50%);
  }

  .wrapper {
    @apply w-full flex flex-col;
  }

  #refresh-wrapper {
    @apply cursor-pointer py-6 px-4;
    background-color: transparent;
    transition: background-color 250ms ease-out;
  }

  #refresh-wrapper:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.2);
    transition: background-color 250ms ease-out;
  }

  #refresh-wrapper:active {
    background-color: hsla(var(--secondary-hue), 30%, 75%, 0.4);
    transition: background-color 80ms ease-in;
  }

  @media only screen and (min-width: 768px) {
    .wrapper {
      @apply w-8/12;
    }
  }
</style>

<div
  class="flex flex-col my-8 items-center"
  style="color: var(--text-color)"
  in:fade={{ duration: 80 }}>
  <div class="wrapper">
    {#if Object.keys($userInfo).length === 0}
      <div class="flex justify-center">
        <button
          class="flex bg-white rounded shadow text-gray-700 mx-4 font-bold
          items-center justify-center w-auto"
          style="{$themeIsBright ? 'background-color: hsl(var(--secondary-hue), 50%, 50%); color:var(--background-color)' : 'background-color: var(--text-color); color: var(--inactive-button-color)'};
          ; height: 40px"
          on:click={() => signIn()}>
          <div
            class="bg-white rounded-l flex items-center justify-center"
            style="height: 40px; width: 40px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 48 48"
              class="w-6 h-6">
              <defs>
                <path
                  id="a"
                  d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2
                  0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6
                  4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8
                  21-22 0-1.3-.2-2.7-.5-4z" />
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
              <path
                clip-path="url(#b)"
                fill="#4285F4"
                d="M48 48L17 24l-4-3 35-10z" />
            </svg>
          </div>
          <span class="mx-4">Sign in with Google</span>
        </button>
      </div>
    {:else}
      <div class="flex flex-row items-center px-4">
        <img
          src={$userInfo.photo}
          alt="User photo"
          class="rounded-full w-8 h-8 mr-4" />
        <span class="name">{$userInfo.name}</span>
        <div class="flex-grow text-right">
          <button class="sign-out-button" on:click={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    {/if}
    <div class="w-auto flex flex-row items-center justify-between mt-12 p-4">
      <span class="label">Theme</span>
      <div class="flex flex-row">
        <div
          class="theme-button bg-white {selectedTheme === 'bright' ? 'selected-theme' : 'border-4 border-gray-400'}"
          on:click={() => switchTheme('bright')} />
        <div
          class="theme-button bg-black {selectedTheme === 'dark' ? 'selected-theme' : 'border-4 border-gray-400'}"
          on:click={() => switchTheme('dark')} />
      </div>
    </div>
    <div
      id="refresh-wrapper"
      class="w-auto flex flex-row items-center justify-between fill-current px-4"
      on:click={() => {
        dashboardShouldReload.set(true);
        handleRouting('dashboard');
        view.set('dashboard');
      }}>
      <span class="label">Full refresh from database</span>
      <i
        class="material-icons-round md-48"
        style="color: hsl(var(--primary-hue), 50%, 50%)">
        cloud_download
      </i>
    </div>
    <div
      class="w-auto text-center my-8 flex flex-row justify-center"
      style="color: var(--text-color2)">
      <a href="/privacy-policy.html" target="_blank" class="mr-2">
        Privacy policy
      </a>
      •
      <span class="text-center mb-8 ml-2">v0.1</span>
    </div>
  </div>
</div>
