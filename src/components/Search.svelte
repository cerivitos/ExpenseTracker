<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { debounce, handleRouting, convertRemToPixels } from "../util";
  import {
    queryString,
    filteredSearchData,
    view,
    overlay
  } from "../store/store";
  import SearchListTile from "./SearchListTile.svelte";

  let scrolling = false;
  let hasClickedSearch = false;
  let query = "";
  let filteredDatas = [];
  let buckets = [];
  let datas;
  let searchFuture;
  let firstDate, lastDate;

  onMount(() => {
    document.getElementById("search-input").focus();

    datas = JSON.parse(localStorage.getItem("rawCache"));

    datas.sort((a, b) => {
      if (b.date > a.date) {
        return 1;
      } else {
        return -1;
      }
    });

    firstDate = new Date(datas[0].date).toString().substring(4, 15);
    lastDate = new Date(datas[datas.length - 1].date)
      .toString()
      .substring(4, 15);

    document.getElementById("search-page").addEventListener("scroll", ev => {
      ev.target.scrollTop > 0 ? (scrolling = true) : (scrolling = false);
    });

    document
      .getElementById("search-input")
      .addEventListener("input", () => (hasClickedSearch = false));

    if (Object.keys($filteredSearchData).length > 0) {
      query = $queryString;
      filteredDatas = $filteredSearchData;
      buckets = createBuckets();
    }
  });

  function createBuckets() {
    let buckets = [];

    filteredDatas.forEach((data, i, arry) => {
      const year = +data.date.substring(0, 4);
      const month = +data.date.substring(5, 7);
      let previousYear, previousMonth;

      if (buckets.length > 0) {
        previousYear = +buckets[buckets.length - 1].year;
        previousMonth = +buckets[buckets.length - 1].month;
      }

      if (i > 0 && year + month !== previousYear + previousMonth) {
        buckets.push({
          year: year,
          month: month
        });
      } else if (i === 0) {
        buckets.push({
          year: year,
          month: month
        });
      }
    });

    buckets.sort((first, second) => {
      if (first.month > second.month) {
        return 1;
      } else {
        return -1;
      }
    });

    buckets.sort((first, second) => {
      if (first.year < second.year) {
        return 1;
      } else {
        return -1;
      }
    });

    return buckets;
  }

  function searchData(query) {
    hasClickedSearch = true;

    buckets = [];

    if (datas && query.length > 0) {
      filteredDatas = datas.filter(data => {
        let keep = false;

        for (let key in data) {
          if (key !== "id" && key !== "addedOn" && key !== "amount") {
            const value = data[key.toString()].toString().toLowerCase();

            if (value.includes(query.toLowerCase().trim())) {
              const startHighlightIndex = value.indexOf(
                query.toLowerCase().trim()
              );
              const endHighlightIndex = startHighlightIndex + query.length;
              data.highlightKey = key;

              keep = true;
            }
          }
        }

        return keep;
      });

      buckets = createBuckets();
      filteredSearchData.set(filteredDatas);
    }
  }
</script>

<style type="text/postcss">
  .searchbar {
    height: 56px;
    background-color: var(--background-color);
    color: var(--text-color);
    @apply fixed top-0 justify-between z-20 w-full flex flex-row p-4;
  }

  .entry-anim {
    animation: 360ms search ease-out;
  }

  @keyframes search {
    0% {
      transform: translateY(30px) scale(0);
      transform-origin: bottom center;
      border-radius: 9999px;
    }
    50% {
      background-color: var(--inactive-button-color);
    }
    75% {
      transform: translateY(0px) scale(1);
    }
    100% {
      border-radius: 0;
      background-color: var(--background-color);
    }
  }

  #search-input {
    @apply mx-4 flex bg-transparent appearance-none w-full text-lg;
    outline: none !important;
    color: var(--text-color2);
  }

  .wrap::before {
    border-top: 1px solid var(--inactive-button-color);
    transform: translateY(-50%);
    position: absolute;
    left: 5%;
    top: 50%;
    width: 90%;
    content: "";
  }

  .content-wrapper {
    @apply flex flex-col w-full;
  }

  @media only screen and (min-width: 768px) {
    .content-wrapper {
      @apply w-6/12;
    }

    #search-input {
      @apply w-6/12 text-center;
    }
  }
</style>

<div
  id="search-page"
  class="h-screen w-full absolute top-0 overflow-auto pb-8"
  style="background-color: var(--background-color)"
  on:keyup={ev => {
    if (ev.key === 'Escape') {
      query = '';
    }
  }}
  out:fade={{ duration: 80 }}>
  <div
    class="{scrolling ? 'shadow' : ''} searchbar {Object.keys($filteredSearchData).length > 0 ? '' : 'entry-anim'}">
    <button>
      <i
        class="material-icons-round fill-current"
        style="color: hsl(var(--primary-hue), 50%, 50%)"
        aria-label="Back button"
        on:click={() => {
          filteredSearchData.set({});
          handleRouting('dashboard');
          view.set('dashboard');
          overlay.set('');
        }}>
        arrow_back
      </i>
    </button>
    <div id="input-wrapper" class="flex justify-center w-full">
      <input
        id="search-input"
        type="text"
        placeholder="Search"
        autocomplete="off"
        bind:value={query}
        on:keyup={ev => {
          if (ev.key === 'Enter') {
            queryString.set(query);
            searchData(query);
          }
        }} />
    </div>
    <button>
      <i
        class="material-icons-round fill-current"
        style="color: hsl(var(--primary-hue), 50%, 50%)"
        aria-label="Search button"
        on:click={() => {
          queryString.set(query);
          searchData(query);
        }}>
        search
      </i>
    </button>
  </div>
  <div id="content" class="w-full flex flex-col items-center mt-16">
    <div class="content-wrapper">
      {#if filteredDatas.length > 0 && query.length > 0}
        {#each buckets as bucket, index}
          {#if index === 0 || (index > 0 && buckets[index - 1].year !== bucket.year)}
            <span
              class="rounded-full font-bold px-4 py-2 my-4 sticky top-0 z-10
              m-auto"
              style="top: {56 + convertRemToPixels(1)}px; color:
              var(--text-color); background-color:var(--inactive-button-color)">
              {bucket.year}
            </span>
          {/if}
          <div class="flex flex-col justify-center items-center">
            <div class="wrap w-full relative text-center mt-4 mb-2">
              <span
                class="relative font-bold px-4"
                style="color:var(--text-color2); background-color:
                var(--background-color)">
                {new Date(2019, bucket.month - 1, 1)
                  .toDateString()
                  .substring(4, 7)}
              </span>
            </div>
            {#each filteredDatas as data, index (data.id)}
              {#if data.date.substring(0, 4) == bucket.year && data.date.substring(5, 7) == bucket.month}
                <SearchListTile {data} {index} />
              {/if}
            {/each}
          </div>
        {/each}
      {:else if filteredDatas.length === 0 && hasClickedSearch}
        <div
          transition:fade={{ duration: 120 }}
          class="w-auto mt-24 text-center flex flex-col items-center
          justify-center mx-4">
          <span class="text-4xl mb-2">🔍</span>
          <span class="text-2xl" style="color: var(--text-color)">
            Nothing found between
          </span>
          <span class="text-2xl font-bold" style="color: var(--text-color2)">
            {lastDate} — {firstDate}
          </span>
          <span class="mt-2" style="color: var(--text-color)">
            Try changing the Dashboard interval to download more data
          </span>
        </div>
      {/if}
    </div>
  </div>
</div>
