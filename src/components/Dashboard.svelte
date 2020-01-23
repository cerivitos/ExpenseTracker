<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import {
    toastMessage,
    dashboardShouldReload,
    overlay,
    userInfo,
    themeIsBright
  } from "../store/store";
  import { fade } from "svelte/transition";
  import CategoryListTile from "./CategoryListTile.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { CountUp } from "countup.js";
  import { handleRouting } from "../util";

  let db, queryInterval;
  let getDataPromise = fetchData(queryInterval);
  let rawData = [];
  let categorizedData = [];
  let currentInterval = "1M";
  let totalSpend = 0;
  let currentCounterValue = 0;
  let showSignIn = false;

  let firstDate = "";
  let lastDate = "";

  onMount(() => {
    if (localStorage.getItem("interval")) {
      currentInterval = localStorage.getItem("interval");
    }

    if (localStorage.getItem("categorizedCache")) {
      categorizedData = JSON.parse(localStorage.getItem("categorizedCache"));
    }

    changeInterval(currentInterval);
  });

  function changeInterval(interval) {
    currentInterval = interval;
    localStorage.setItem("interval", currentInterval);

    if (localStorage.getItem("rawCache")) {
      rawData = JSON.parse(localStorage.getItem("rawCache"));
    }

    db = firebase.firestore();

    queryInterval = getQueryInterval(currentInterval);

    if (rawData.length > 0) {
      const sortedRawData = rawData.sort(
        (a, b) => new Date(a.addedOn) - new Date(b.addedOn)
      );
      const earliestDate = sortedRawData[0].addedOn;
      const lastDate = sortedRawData[sortedRawData.length - 1].addedOn;
      const currentDate = new Date().toISOString().substring(0, 10);

      if (queryInterval >= earliestDate) {
        //Existing data already covers queryInterval, only get new data after last date
        getDataPromise = fetchData(lastDate, currentDate);
      } else {
        //Only get the missing portion between queryInterval and the earliest existing data
        getDataPromise = fetchData(queryInterval, earliestDate);
      }
    } else {
      getDataPromise = fetchData(
        queryInterval,
        new Date().toISOString().substring(0, 10)
      );
    }
  }

  function getQueryInterval(interval) {
    const currentDate = new Date(new Date().setDate(1));

    let queryDate;

    if (interval === "1M") {
      queryDate = new Date(currentDate.setDate(1));
    } else if (interval === "6M") {
      queryDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    } else if (interval === "1Y") {
      queryDate = new Date(currentDate.setMonth(0));
    } else if (interval === "All") {
      queryDate = new Date("1999-01-01");
    }

    return parseDateString(
      queryDate.getFullYear(),
      queryDate.getMonth() + 1,
      queryDate.getDate()
    );
  }

  function parseDateString(year, month, date) {
    let monthString, dateString;

    if (month < 10) {
      monthString = "0" + month;
    } else {
      monthString = month;
    }

    if (date < 10) {
      dateString = "0" + date;
    } else {
      dateString = date;
    }

    return year + "-" + monthString + "-" + dateString;
  }

  async function fetchData(queryInterval, endDate) {
    const lastUpdated = localStorage.getItem("lastUpdated");

    let rawData = [];
    let categorizedData = [];
    let snapshot, snapshotNewlyUpdated;

    try {
      snapshot = await db
        .collection("expenses")
        .where("date", ">=", queryInterval)
        .where("date", "<=", endDate)
        .get();
    } catch (error) {
      console.error(error.message);
    }

    //Get data that has been updated after the last user download from firestore. This is because entries may be updated/edited again at a different date from the expense date (addedOn !== date)
    if (lastUpdated) {
      try {
        snapshotNewlyUpdated = await db
          .collection("expenses")
          .where("addedOn", ">=", lastUpdated)
          .where("addedOn", "<=", new Date().toISOString().substring(0, 10))
          .get();
      } catch (error) {
        console.error(error.message);

        if (error.code == "permission-denied") {
          showSignIn = true;
        }
      }
    }

    let rawCache = [];

    if (localStorage.getItem("rawCache")) {
      rawCache = JSON.parse(localStorage.getItem("rawCache"));
    }

    //Only append new data if they do not exist in rawCache
    snapshot.forEach(doc => {
      const data = doc.data();
      if (rawCache.filter(rawData => rawData.id === data.id).length === 0) {
        //Doc doesn't exist, push it to local cache
        data.id = doc.id;
        rawCache.push(data);
      }
    });

    //Handle existing data that has changed since user last downloaded from firestore
    if (snapshotNewlyUpdated) {
      snapshotNewlyUpdated.forEach(doc => {
        const data = doc.data();
        rawCache.forEach((rawData, index) => {
          if (rawData.id === doc.id) {
            rawCache[index] = data;
          }
        });
      });
    }

    //Only keep data that is at or after the real queryInterval (not the modified queryInterval which is to reduce firestore reads)
    rawData = rawCache.filter(
      rawData => rawData.date >= getQueryInterval(currentInterval)
    );

    rawData.sort((a, b) => {
      if (b.date > a.date) {
        return 1;
      } else {
        return -1;
      }
    });

    firstDate = new Date(rawData[0].date).toString().substring(4, 15);
    lastDate = new Date(rawData[rawData.length - 1].date)
      .toString()
      .substring(4, 15);

    localStorage.setItem("rawCache", JSON.stringify(rawCache));
    localStorage.setItem(
      "lastUpdated",
      new Date().toISOString().substring(0, 10)
    );

    const types = [...new Set(rawData.map(item => item.type))];

    types.forEach(type => {
      categorizedData.push({
        type: type,
        data: [],
        sum: 0,
        items: 0,
        percentage: 0
      });
    });

    categorizedData.forEach(categoryData => {
      rawData.forEach(data => {
        if (data.type === categoryData.type) {
          categoryData.data.push(data);
        }
      });

      //Get sum of amounts for each category
      let sum = 0;
      categoryData.data.forEach(data => {
        sum += data.amount;
      });
      categoryData.sum = Math.round(sum * 100) / 100;

      //Get number of data items for each category
      categoryData.items = categoryData.data.length;
    });

    //Sort by category sum
    categorizedData.sort((a, b) => b.sum - a.sum);

    //Get percentage proportion for each category
    totalSpend = categorizedData.reduce(
      (a, b) => (a.sum ? a.sum : a + b.sum),
      0
    );
    categorizedData.forEach(data => {
      data.percentage = (data.sum / totalSpend) * 100;
    });

    localStorage.setItem("categorizedCache", JSON.stringify(categorizedData));

    const counter = new CountUp("totalSpend", totalSpend, {
      prefix: "$",
      duration: 1,
      startVal: currentCounterValue
    });
    counter.start();

    currentCounterValue = totalSpend;

    return categorizedData;
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

        showSignIn = false;

        changeInterval(currentInterval);
      })
      .catch(function(error) {
        console.error(error);

        userInfo.set({});
        toastMessage.set(error.message);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  $: if ($dashboardShouldReload) {
    localStorage.removeItem("rawCache");
    rawData = [];
    localStorage.removeItem("lastUpdated");
    changeInterval(currentInterval);
    dashboardShouldReload.set(false);
  }
</script>

<style type="text/postcss">
  .interval-button-wrapper {
    @apply flex flex-row justify-around overflow-x-hidden mb-16 mx-4;
  }

  .interval-button {
    @apply rounded-full py-1 font-bold w-1/4 flex-grow;
    transition: background-color 350ms;
    background-color: var(--inactive-button-color);
    color: var(--text-color2);
  }

  .interval-button:hover {
    background-color: hsla(var(--secondary-hue), 40%, 85%, 0.4);
    transition: background-color 250ms ease-out;
  }

  .interval-button:not(:last-child) {
    @apply mr-2;
  }

  .interval-button.active {
    background-color: hsl(var(--secondary-hue), 50%, 50%);
    color: whitesmoke;
  }

  .searchbar {
    @apply flex items-center justify-center py-2 mx-4 mb-12 rounded-full
    text-center;
    color: var(--text-color2);
    background-color: var(--inactive-button-color);
    transition: background-color 250ms ease-out;
  }

  .searchbar:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.4);
    transition: background-color 250ms ease-out;
  }

  .searchbar:active {
    background-color: hsl(var(--secondary-hue), 30%, 85%, 0.4);
    transition: background-color 250ms ease-out;
  }

  .overall-wrapper {
    @apply flex flex-col w-full;
  }

  @media only screen and (min-width: 768px) {
    .overall-wrapper {
      @apply w-8/12;
    }
  }
</style>

<div
  class="flex flex-col w-full items-center my-8 {$overlay.length > 0 ? 'hidden' : ''}"
  in:fade={{ duration: 80 }}
  style="color: var(--text-color)">
  <div class="overall-wrapper">
    <button
      class="searchbar"
      on:click={() => {
        handleRouting('search');
        overlay.set('search');
      }}>
      <i class="material-icons-round fill-current">search</i>
      Search
    </button>
    <span class="w-full mb-1 text-4xl text-center font-bold" id="totalSpend">
      $0
    </span>
    {#if firstDate.length > 0 && lastDate.length > 0}
      <span
        class="w-full text-center font-light mb-12"
        style="color: var(--text-color2)"
        in:fade={{ duration: 180 }}>
        {lastDate + ' — ' + firstDate}
      </span>
    {:else}
      <span class="w-full text-center text-transparent font-light mb-12">
        &nbsp;
      </span>
    {/if}
    <div class="interval-button-wrapper">
      {#each ['1M', '6M', '1Y', 'All'] as interval}
        <button
          class="interval-button {currentInterval === interval ? 'active' : ''}"
          on:click={() => changeInterval(interval)}>
          {interval}
        </button>
      {/each}
    </div>
  </div>
  {#await getDataPromise}
    <LoadingSpinner />
  {:then result}
    {#each result as data, index}
      <CategoryListTile {data} {index} />
    {/each}
  {/await}
  {#if showSignIn}
    <div
      class="flex flex-col items-center justify-center w-full"
      in:fade={{ duration: 180 }}>
      <span class="text-4xl mx-4">📝</span>
      <span class="mx-4 mt-2 mb-8 text-lg" style="color: var(--text-color)">
        You must be signed in to continue
      </span>
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
                4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22
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
            <path
              clip-path="url(#b)"
              fill="#4285F4"
              d="M48 48L17 24l-4-3 35-10z" />
          </svg>
        </div>
        <span class="mx-4">Sign in with Google</span>
      </button>
    </div>
  {/if}
</div>
