<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { debounce, handleRouting } from "../util";
  import {
    queryString,
    filteredSearchData,
    view,
    overlay
  } from "../store/store";
  import SearchListTile from "./SearchListTile.svelte";

  let scrolling = false;
  let query = "";
  let filteredDatas = [];
  let datas;
  let searchFuture;

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

    document.getElementById("search-page").addEventListener("scroll", ev => {
      ev.target.scrollTop > 0 ? (scrolling = true) : (scrolling = false);
    });

    document.getElementById("search-input").oninput = () => {
      queryString.set(query);
      debounce(searchData(query), 800);
    };

    if (Object.keys($filteredSearchData).length > 0) {
      query = $queryString;
      filteredDatas = $filteredSearchData;
    }
  });

  function searchData(query) {
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
    75% {
      transform: translateY(0px) scale(1);
      background-color: var(--inactive-button-color);
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

  .content-wrapper {
    @apply flex flex-col w-full;
  }

  @media only screen and (min-width: 768px) {
    .content-wrapper {
      @apply w-6/12;
    }

    #search-input {
      @apply w-6/12;
    }
  }
</style>

<div
  id="search-page"
  class="h-screen w-full absolute top-0 overflow-auto"
  style="background-color: var(--background-color)"
  out:fade={{ duration: 80 }}>
  <div
    class="{scrolling ? 'shadow' : ''} searchbar {Object.keys($filteredSearchData).length > 0 ? '' : 'entry-anim'}">
    <button>
      <i
        class="material-icons fill-current"
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
    <input
      id="search-input"
      type="text"
      placeholder="Search"
      bind:value={query} />
  </div>
  <div id="content" class="w-full flex flex-col items-center mt-16">
    <div class="content-wrapper">
      {#if datas && query.length > 0}
        {#each filteredDatas as data (data.id)}
          <SearchListTile {data} />
        {/each}
      {/if}
    </div>
  </div>
</div>
