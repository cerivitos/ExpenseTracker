<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { debounce } from "../util";
  import DetailListTile from "./DetailListTile.svelte";

  let scrolling = false;
  let query = "";
  let datas;
  let filteredDatas = [];

  onMount(() => {
    document.getElementById("search-input").focus();

    datas = JSON.parse(localStorage.getItem("rawCache"));

    document.getElementById("search-page").addEventListener("scroll", ev => {
      ev.target.scrollTop > 0 ? (scrolling = true) : (scrolling = false);
    });
  });

  function searchData(query) {
    filteredDatas = datas.filter(data => {
      let include = false;
      for (let key in data) {
        const value = data[key.toString()].toString().toLowerCase();

        if (value.includes(query.toLowerCase().trim()) && key !== "id") {
          include = true;
        }
      }
      return include;
    });
  }

  $: if (datas) debounce(searchData(query), 800);
</script>

<style type="text/postcss">
  .searchbar {
    height: 56px;
    animation: 360ms search ease-out;
    @apply fixed top-0 justify-between z-20 bg-white w-full flex flex-row p-4;
  }

  @keyframes search {
    0% {
      transform: translateY(30px) scale(0);
      transform-origin: bottom center;
      border-radius: 9999px;
    }
    75% {
      transform: translateY(0px) scale(1);
      background-color: #edf2f7;
    }
    100% {
      border-radius: 0;
      background-color: white;
    }
  }
</style>

<div
  id="search-page"
  class="h-screen w-full bg-white absolute top-0 overflow-auto"
  out:fade={{ duration: 80 }}>
  <div class="{scrolling ? 'shadow' : ''} searchbar">
    <i
      class="material-icons fill-current"
      style="color: hsl(var(--primary-hue), 50%, 50%)"
      aria-label="Back button"
      on:click={() => {
        window.history.back();
      }}>
      arrow_back
    </i>
    <input
      id="search-input"
      type="text"
      placeholder="Search"
      bind:value={query}
      class="mx-4 text-gray-600 flex bg-transparent appearance-none w-full
      text-lg"
      style="outline: none !important;" />
  </div>
  <div id="content" class="w-full flex flex-col mt-16">
    {#if query.length > 0}
      {#each filteredDatas as data, index}
        <DetailListTile {data} {index} />
      {/each}
    {/if}
  </div>
</div>
