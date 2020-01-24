<script>
  import { onMount, onDestroy } from "svelte";
  import { fly, fade, scale, crossfade } from "svelte/transition";
  import { typeDesigns, convertRemToPixels, handleRouting } from "../util";
  import {
    detailData,
    overlay,
    entryData,
    view,
    themeIsBright,
    firstDate,
    lastDate
  } from "../store/store";
  import { quintOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import SearchListTile from "./SearchListTile.svelte";
  import { CountUp } from "countup.js";

  let materialIcon, backgroundColor, iconColor;
  let scrolling = false;
  let sortByDate = true;
  let sortedData = [];

  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      return {
        duration: 120,
        easing: quintOut,
        css: t => `
					opacity: ${t}
				`
      };
    }
  });

  onMount(() => {
    console.log(Math.round($detailData.sum));
    const typeDesign = typeDesigns.filter(
      obj => obj.type === $detailData.type
    )[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";

    document.getElementById("detail-page").addEventListener("scroll", ev => {
      ev.target.scrollTop > 0 ? (scrolling = true) : (scrolling = false);
    });

    const counter = new CountUp(
      "totalCategorySpend",
      Math.round($detailData.sum),
      {
        prefix: "$",
        duration: 1,
        startVal: 0
      }
    );
    counter.start();
  });

  onDestroy(() => {
    if ($overlay !== "entry") {
      detailData.set({});
    }
  });

  $: if ($detailData.data) {
    if (sortByDate) {
      sortedData = $detailData.data.sort((a, b) => {
        if (b.date > a.date) {
          return 1;
        } else {
          return -1;
        }
      });
    } else {
      sortedData = $detailData.data.sort((a, b) => b.amount - a.amount);
    }
  }
</script>

<style type="text/postcss">
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
  }
</style>

<div
  id="detail-page"
  class="h-screen w-full absolute top-0 overflow-auto pb-8"
  style="background-color: var(--background-color); color: {$themeIsBright ? iconColor : backgroundColor}"
  out:fade={{ duration: 80 }}>
  <div
    class="w-full flex flex-row p-4 {scrolling ? 'shadow' : ''} fixed top-0
    justify-between z-10"
    style="height: 56px; background-color: var(--background-color)">
    <button>
      <i
        class="material-icons-round fill-current"
        on:click={() => {
          handleRouting('dashboard');
          view.set('dashboard');
          overlay.set('');
        }}>
        arrow_back
      </i>
    </button>
    <button
      on:click={() => (sortByDate = !sortByDate)}
      class="fill-current"
      in:fade={{ duration: 80 }}>
      <div class="relative">
        {#if sortByDate}
          <i
            class="material-icons-round md-18"
            in:fly={{ y: -48, duration: 80 }}>
            date_range
          </i>
        {:else}
          <i
            class="material-icons-round md-18"
            in:fly={{ y: -48, duration: 80 }}>
            attach_money
          </i>
        {/if}
      </div>
    </button>
  </div>
  <div
    id="content"
    class="flex flex-col w-full items-center"
    style="background-color: var(--background-color)">
    <div class="content-wrapper">
      <div class="flex flex-col items-center">
        <div
          class="icon rounded-full p-6 mt-20 mb-4"
          id="icon"
          in:scale={{ initial: 0.0, duration: 240, delay: 80 }}
          style="background-color: {backgroundColor}">
          <i
            class="material-icons-round fill-current"
            style="display:block !important; color: {iconColor}; font-size: 64px">
            {materialIcon}
          </i>
        </div>
        <span
          class="text-2xl font-bold mb-8"
          in:fly={{ y: 48, duration: 180, delay: 180 }}
          style="color: {$themeIsBright ? iconColor : backgroundColor}">
          {$detailData.type}
        </span>
        <span
          class="w-full mb-1 text-4xl text-center font-bold"
          id="totalCategorySpend">
          $0
        </span>
        <span
          class="w-full text-center font-light mb-2"
          style="color: var(--text-color2)"
          in:fade={{ duration: 180 }}>
          {$lastDate + ' — ' + $firstDate}
        </span>
        <span class="w-full text-center mb-12">{$detailData.items} items</span>
      </div>
      {#each sortedData as data, index (data.id)}
        <div
          in:receive={{ key: data.id }}
          out:send={{ key: data.id }}
          animate:flip={{ duration: 350 }}
          class="w-full text-center">
          {#if index === 0 || new Date(data.date).getFullYear() !== new Date(sortedData[index - 1].date).getFullYear()}
            <span
              class="rounded-full font-bold px-4 py-2 my-4 inline-block m-auto"
              style="color: var(--text-color);
              background-color:var(--inactive-button-color)">
              {new Date(data.date).getFullYear()}
            </span>
          {/if}
          <SearchListTile {data} />
        </div>
      {/each}
    </div>
  </div>
</div>
