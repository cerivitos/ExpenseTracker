<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { toastMessage } from "../store/store";
  import ApexCharts from "apexcharts";

  let db;
  let currentInterval = "1M";
  let queryInterval;
  let totalSpend = 0;

  onMount(() => {
    if (localStorage.getItem("interval")) {
      currentInterval = localStorage.getItem("interval");
    }

    db = firebase.firestore();

    queryInterval = getQueryInterval(currentInterval);

    db.collection("expenses")
      .where("date", ">=", queryInterval)
      .where("date", "<=", new Date().toISOString().substring(0, 10))
      .onSnapshot(snapshot => {
        localStorage.setItem("cache", JSON.stringify(snapshot.docs));
      });
  });

  function changeInterval(interval) {
    currentInterval = interval;
    localStorage.setItem("interval", currentInterval);
    queryInterval = getQueryInterval(currentInterval);
    fetchData(queryInterval);
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

  function fetchData(queryInterval) {
    toastMessage.set("Updating...");

    db.collection("expenses")
      .where("date", ">=", queryInterval)
      .where("date", "<=", new Date().toISOString().substring(0, 10))
      .get()
      .then(querySnapshot => {
        toastMessage.set("");
        querySnapshot.forEach(query => {
          console.log(query.data());
        });
      })
      .catch(err => {
        toastMessage.set(err);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }
</script>

<style type="text/postcss">
  .interval-button {
    @apply rounded-full bg-gray-300 text-white py-1 font-bold w-1/4 flex-grow;
    transition: background-color 350ms;
  }

  .interval-button:not(:last-child) {
    @apply mr-2;
  }

  .interval-button.active {
    background-color: hsl(var(--secondary-hue), 50%, 50%);
  }
</style>

<div class="flex flex-col mx-4 my-8">
  <span class="w-full mb-1 text-4xl text-center font-bold">${totalSpend}</span>
  <span class="w-full text-center text-gray-600 text-sm font-light mb-8">
    Total spend
  </span>
  <div class="w-full h-64 bg-gray-400 mb-8" />
  <div class="flex flex-row justify-around overflow-x-scroll">
    {#each ['1M', '6M', '1Y', 'All'] as interval}
      <button
        class="interval-button {currentInterval === interval ? 'active' : ''}"
        on:click={() => changeInterval(interval)}>
        {interval}
      </button>
    {/each}
  </div>
</div>
