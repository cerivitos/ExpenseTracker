<script>
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { typeDesigns, handleRouting } from "../util";
  import { view } from "../store/store";

  export let data;
  export let index;

  let materialIcon, backgroundColor, iconColor, barColor;
  let buckets = [];
  let expanded = false;

  onMount(() => {
    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";
    barColor = "hsl(" + hue + ", 45%, 95%)";

    data.data.forEach((data, i, arry) => {
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
    console.log(buckets);
  });

  function viewDetails() {
    handleRouting("detail#" + data.type);
    view.set("detail");
  }
</script>

<div
  class="relative py-4 flex flex-row items-center"
  in:fade={{ duration: 80, delay: index * 50 }}
  out:fade={{ duration: 80 }}
  on:click={() => viewDetails()}>
  <div
    class="rounded-full p-2 ml-4 mr-2 fill-current"
    style="background-color: {backgroundColor}; color:{iconColor}">
    <i class="material-icons md-18" style="display:block !important">
      {materialIcon}
    </i>
  </div>
  <div class="flex flex-col justify-between truncate flex-grow">
    <span class="font-bold">{data.type}</span>
    <span class="font-light text-gray-600">
      {data.items} {data.items > 1 ? 'entries' : 'entry'}
    </span>
  </div>
  <div class="flex flex-col justify-between items-end ml-2 mr-4">
    <span>${Math.round(data.sum)}</span>
    <span class="font-light text-gray-600">{Math.round(data.percentage)}%</span>
  </div>
  <div
    class="absolute left-0 top-0 h-full rounded-r"
    in:fly={{ x: -(window.innerWidth * data.percentage) / 100, duration: 180, delay: index * 80 }}
    style="width: {(window.innerWidth * data.percentage) / 100}px;
    z-index:-1;background-color:{barColor}" />
</div>
{#if expanded}
  {#each buckets as bucket}
    <div class="p-4">
      {bucket.year}
      {new Date(2019, bucket.month - 1, 1).toString().substring(4, 7)}
    </div>
  {/each}
  <!-- {#each data.data as item}
    <div class="flex flex-row justify-between items-center p-4">
      <div class="flex flex-col">
        <div class="flex flex-row flex-grow">
          <span class="mr-1">
            {new Date(item.date).toLocaleDateString('default', {
              day: 'numeric',
              weekday: 'short',
              year: '2-digit',
              month: 'short'
            })}
          </span>
          •
          <span class="ml-1 mr-2 truncate text-gray-600">{item.addedBy}</span>
        </div>
        <span>{item.desc}</span>
      </div>
      <div>${item.amount.toFixed(2).toLocaleString()}</div>
    </div>
  {/each} -->
{/if}
