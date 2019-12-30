<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { toastMessage } from "../store/store";
  import ApexCharts from "apexcharts";
  import { fade } from "svelte/transition";
  import CategoryListTile from "./CategoryListTile.svelte";

  let db, queryInterval;
  let getDataPromise = fetchData(queryInterval);
  let categorizedData = [];
  let currentInterval = "1M";
  let totalSpend = 0;

  onMount(() => {
    if (localStorage.getItem("interval")) {
      currentInterval = localStorage.getItem("interval");
    }

    db = firebase.firestore();

    queryInterval = getQueryInterval(currentInterval);

    getDataPromise = fetchData(queryInterval);
  });

  function changeInterval(interval) {
    currentInterval = interval;
    localStorage.setItem("interval", currentInterval);
    queryInterval = getQueryInterval(currentInterval);
    getDataPromise = fetchData(queryInterval);
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

  async function fetchData(queryInterval) {
    toastMessage.set("Updating...");

    let rawData = [];
    let categorizedData = [];

    const snapshot = await db
      .collection("expenses")
      .where("date", ">=", queryInterval)
      .where("date", "<=", new Date().toISOString().substring(0, 10))
      .get();

    let rawCache = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      rawCache.push(data);
    });

    toastMessage.set("");

    localStorage.setItem("rawCache", JSON.stringify(rawCache));
    rawData = rawCache;

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
    const totalSpend = categorizedData.reduce(
      (a, b) => (a.sum ? a.sum : a + b.sum),
      0
    );
    categorizedData.forEach(data => {
      data.percentage = (data.sum / totalSpend) * 100;
    });

    localStorage.setItem("categorizedCache", JSON.stringify(categorizedData));

    return categorizedData;
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

<div class="flex flex-col my-8">
  <span class="w-full mb-1 text-4xl text-center font-bold">${totalSpend}</span>
  <span class="w-full text-center text-gray-600 text-sm font-light mb-8">
    Total spend
  </span>
  <div class="w-full h-64 bg-gray-400 mb-8" />
  <div class="flex flex-row justify-around overflow-x-scroll mb-8 mx-4">
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
