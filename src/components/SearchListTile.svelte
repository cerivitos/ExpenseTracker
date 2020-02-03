<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import {
    queryString,
    entryData,
    detailData,
    overlay,
    themeIsBright
  } from "../store/store";
  import { typeDesigns, handleRouting } from "../util";

  export let data;

  let mounted = false;

  let date, addedBy, desc, amount;
  let iconHue, materialIcon, backgroundColor, iconColor;

  onMount(() => {
    date = new Date(data.date).toString().substring(4, 15);
    addedBy = data.addedBy;
    amount = data.amount;
    desc = data.desc;

    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";

    mounted = true;
  });

  function insertHighlight(queryString, textToHighlight) {
    const startHighlightIndex = textToHighlight
      .toLowerCase()
      .trim()
      .indexOf(queryString.toLowerCase());
    const endHighlightIndex = startHighlightIndex + queryString.length;

    return (
      textToHighlight.slice(0, startHighlightIndex) +
      '<span class="font-bold" style="color: hsl(var(--secondary-hue), 50%, 50%); background-color: hsl(var(--secondary-hue), 35%, 90%)">' +
      textToHighlight.slice(startHighlightIndex, endHighlightIndex) +
      "</span>" +
      textToHighlight.slice(endHighlightIndex, textToHighlight.length)
    );
  }

  function showEditDetail(data) {
    handleRouting("entry");
    entryData.set(data);
    overlay.set("entry");
  }

  $: if (data.highlightKey && mounted) {
    const highlightKey = data.highlightKey;
    addedBy = data.addedBy;
    desc = data.desc;

    if (highlightKey === "addedBy") {
      addedBy = insertHighlight($queryString, addedBy);
    } else if (highlightKey === "desc") {
      desc = insertHighlight($queryString, desc);
    }
  }
</script>

<style type="text/postcss">
  .amount:before {
    content: "$";
    @apply text-sm font-light mr-1;
  }

  #tile-wrapper {
    background-color: transparent;
    transition: background-color 250ms ease-out;
  }

  #tile-wrapper:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.2);
    transition: background-color 250ms ease-out;
  }

  #tile-wrapper:active {
    background-color: hsla(var(--secondary-hue), 30%, 75%, 0.4);
    transition: background-color 80ms ease-in;
  }
</style>

<div
  id="tile-wrapper"
  class="flex w-full p-4 items-center cursor-pointer"
  style="color: var(--text-color)"
  in:fade={{ duration: 120 }}
  on:click={() => showEditDetail(data)}>
  {#if window.innerWidth > 768}
    <div
      class="mr-2 font-bold text-sm whitespace-no-wrap"
      style="color:{$themeIsBright ? iconColor : backgroundColor}; width: 12.5%">
      <span>{new Date(data.date).toString().substring(4, 10)}</span>
    </div>
    <div
      id="icon"
      class="rounded-full p-1 mr-2 fill-current"
      style="background-color: {backgroundColor}; color:{iconColor}">
      <i
        class="material-icons-round"
        style="display:block !important; font-size: 14px">
        {materialIcon}
      </i>
    </div>
    <span class="truncate mr-2 flex-none font-medium">
      {@html addedBy}
    </span>
    <span class="truncate mr-2" style="color: var(--text-color2)">
      {@html desc}
    </span>
    <span class="flex-grow flex items-center justify-end font-bold amount">
      {@html data.amount.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}
    </span>
  {:else}
    <div class="flex flex-col w-full">
      <div
        id="icon-date-amount-wrapper"
        class="w-full justify-between items-center">
        <div id="icon-date-wrapper" class="flex items-center justify-start">
          <div
            class="mr-2 font-bold text-sm text-left whitespace-no-wrap"
            style="color:{$themeIsBright ? iconColor : backgroundColor}; width:
            12.5%">
            <span>{new Date(data.date).toString().substring(4, 10)}</span>
          </div>
          <div
            id="icon"
            class="rounded-full p-1 mr-2 fill-current"
            style="background-color: {backgroundColor}; color:{iconColor}">
            <i
              class="material-icons-round"
              style="display:block !important; font-size: 14px">
              {materialIcon}
            </i>
          </div>
          <span
            class="flex-grow h-full flex items-center justify-end font-bold
            amount">
            {@html data.amount.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </span>
        </div>
      </div>
      <div id="name-desc-wrapper" class="flex items-center justify-start">
        <span class="truncate mr-2 flex-none font-medium">
          {@html addedBy}
        </span>
        <span class="truncate" style="color: var(--text-color2)">
          {@html desc}
        </span>
      </div>
    </div>
  {/if}

</div>
