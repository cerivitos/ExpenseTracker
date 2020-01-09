<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { toastMessage, dashboardShouldReload } from "../store/store";
  import { fade } from "svelte/transition";
  import CategoryListTile from "./CategoryListTile.svelte";
  import { CountUp } from "countup.js";

  let db, queryInterval;
  let getDataPromise = fetchData(queryInterval);
  let rawData = [];
  let categorizedData = [];
  let currentInterval = "1M";
  let totalSpend = 0;
  let currentCounterValue = 0;

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
    toastMessage.set("Updating...");

    let rawData = [];
    let categorizedData = [];
    let snapshot;

    try {
      snapshot = await db
        .collection("expenses")
        .where("date", ">=", queryInterval)
        .where("date", "<=", endDate)
        .get();
    } catch (error) {
      toastMessage.set(error.message);
      setTimeout(() => toastMessage.set(""), 3000);
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

    toastMessage.set("");

    localStorage.setItem("rawCache", JSON.stringify(rawCache));

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

  $: if ($dashboardShouldReload) {
    localStorage.removeItem("rawCache");
    changeInterval(currentInterval);
    dashboardShouldReload.set(false);
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

<div class="flex flex-col my-8" in:fade={{ duration: 80 }}>
  <span class="w-full mb-1 text-4xl text-center font-bold" id="totalSpend">
    $0
  </span>
  <span class="w-full text-center text-gray-600 font-light mb-8">
    Total spend
  </span>
  <!-- <Chart datas={rawData} queryInterval={getQueryInterval(currentInterval)} /> -->
  <div class="flex flex-row justify-around overflow-x-hidden mb-8 mx-4">
    {#each ['1M', '6M', '1Y', 'All'] as interval}
      <button
        class="interval-button {currentInterval === interval ? 'active' : ''}"
        on:click={() => changeInterval(interval)}>
        {interval}
      </button>
    {/each}
  </div>
  {#await getDataPromise then result}
    {#each result as data, index}
      <CategoryListTile {data} {index} />
    {/each}
  {/await}
</div>
