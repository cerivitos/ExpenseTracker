<script>
  import { onMount } from "svelte";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import { toastMessage } from "../store/store";
  import ApexCharts from "apexcharts";

  let db, queryInterval, dbListener;
  let categorizedData = [];
  let rawData = [];
  let currentInterval = "1M";
  let totalSpend = 0;

  onMount(() => {
    if (localStorage.getItem("interval")) {
      currentInterval = localStorage.getItem("interval");
    }

    if (localStorage.getItem("categorizedCache")) {
      categorizedData = JSON.parse(localStorage.getItem("categorizedCache"));
    }

    db = firebase.firestore();

    queryInterval = getQueryInterval(currentInterval);

    fetchData(queryInterval);
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

    rawData = [];
    categorizedData = [];

    db.collection("expenses")
      .where("date", ">=", queryInterval)
      .where("date", "<=", new Date().toISOString().substring(0, 10))
      .onSnapshot(
        snapshot => {
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
              items: 0
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

          localStorage.setItem(
            "categorizedCache",
            JSON.stringify(categorizedData)
          );

          console.log(categorizedData);
        },
        error => {
          toastMessage.set(error);
          setTimeout(() => toastMessage.set(""), 3000);
        }
      );
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
  <div class="flex flex-row justify-around overflow-x-scroll mb-8">
    {#each ['1M', '6M', '1Y', 'All'] as interval}
      <button
        class="interval-button {currentInterval === interval ? 'active' : ''}"
        on:click={() => changeInterval(interval)}>
        {interval}
      </button>
    {/each}
  </div>
  {#each categorizedData as data}
    <div class="py-4 flex flex-row items-center">
      <div class="rounded-full w-8 h-8 bg-gray-500 mr-2" />
      <div class="flex flex-col justify-between truncate flex-grow">
        <span class="font-bold">{data.type}</span>
      </div>
      <span class="font-bold text-gray-700 text-lg mx-2">
        ${data.sum.toString().split('.')[1] ? (data.sum.toString().split('.')[1].length === 1 ? data.sum + '0' : data.sum) : data.sum}
      </span>
    </div>
  {/each}
</div>
