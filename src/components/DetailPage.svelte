<script>
  import { onMount } from "svelte";
  import { fly, fade, scale, crossfade } from "svelte/transition";
  import { typeDesigns, convertRemToPixels, handleRouting } from "../util";
  import { detailData, overlay, entryData, view } from "../store/store";
  import { quintOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import DetailListTile from "./DetailListTile.svelte";

  let getBucketsPromise = createBuckets();
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

    getBucketsPromise = createBuckets();
  });

  async function createBuckets() {
    let buckets = [];

    await $detailData.data.forEach((data, i, arry) => {
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

  function showEditDetail(data) {
    handleRouting("entry");
    entryData.set(data);
    overlay.set("entry");
  }

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
</style>

<div
  id="detail-page"
  class="h-screen w-full absolute top-0 overflow-auto z-10"
  style="background-color: var(--background-color)"
  out:fade={{ duration: 80 }}>
  <div
    class="w-full flex flex-row p-4 {scrolling ? 'shadow' : ''} fixed top-0
    justify-between z-20"
    style="height: 56px; background-color: var(--background-color)">
    <button>
      <i
        class="material-icons fill-current"
        style="color:{iconColor}"
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
      style="color: {iconColor}"
      in:fade={{ duration: 80 }}>
      <div class="relative">
        {#if sortByDate}
          <i class="material-icons md-18" in:fly={{ y: -48, duration: 80 }}>
            date_range
          </i>
        {:else}
          <i class="material-icons md-18" in:fly={{ y: -48, duration: 80 }}>
            attach_money
          </i>
        {/if}
      </div>
    </button>
  </div>
  <div
    id="content"
    class="flex flex-col"
    style="background-color: var(--background-color)">
    <div class="flex flex-col items-center">
      <div
        class="icon rounded-full p-6 mt-20 mb-4"
        id="icon"
        in:scale={{ initial: 0.0, duration: 240, delay: 80 }}
        style="background-color: {backgroundColor}">
        <i
          class="material-icons fill-current"
          style="display:block !important; color: {iconColor}; font-size: 64px">
          {materialIcon}
        </i>
      </div>
      <span
        class="text-2xl font-bold mb-8"
        in:fly={{ y: 48, duration: 180, delay: 180 }}
        style="color: {iconColor}">
        {$detailData.type}
      </span>
    </div>
    {#await getBucketsPromise then buckets}
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
          {#each sortedData as data, index (data.id)}
            <div
              in:receive={{ key: data.id }}
              out:send={{ key: data.id }}
              animate:flip={{ duration: 350 }}
              class="w-full"
              on:click={() => showEditDetail(data)}>
              {#if data.date.substring(0, 4) == bucket.year && data.date.substring(5, 7) == bucket.month}
                <DetailListTile {backgroundColor} {iconColor} {data} {index} />
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    {/await}
  </div>

</div>
