<script>
  import { fade } from "svelte/transition";
  import scale from "../scale.js";
  import { onMount } from "svelte";
  import { typeDesigns, handleRouting } from "../util";
  import { view, detailData, overlay } from "../store/store";

  export let data;
  export let index;

  let materialIcon, backgroundColor, iconColor, barColor;
  let expanded = false;
  let barStyle = false;

  onMount(() => {
    const typeDesign = typeDesigns.filter(obj => obj.type === data.type)[0];
    const hue = typeDesign.hue;
    materialIcon = typeDesign.materialIcon;
    backgroundColor = "hsl(" + hue + ", 50%, 80%)";
    iconColor = "hsl(" + hue + ", 65%, 40%)";
    barColor = "hsl(" + hue + ", 45%, 50%)";
  });

  function viewDetails() {
    detailData.set(data);
    handleRouting("detail#" + data.type);
    overlay.set("detail");
  }
</script>

<div
  class="relative py-6 {window.innerWidth <= 768 ? 'w-full' : 'w-8/12'} flex
  flex-row items-center cursor-pointer"
  in:fade={{ duration: 80, delay: index * 50 }}
  out:fade={{ duration: 80 }}
  on:click={() => viewDetails()}>
  <div id="items-wrapper" class="z-10 flex flex-row items-center w-full">
    <div
      id="icon"
      class="rounded-full p-2 ml-4 mr-4 fill-current"
      style="background-color: {backgroundColor}; color:{iconColor}">
      <i class="material-icons md-18" style="display:block !important">
        {materialIcon}
      </i>
    </div>
    <div
      class="flex flex-row justify-between truncate flex-grow text-xl font-bold ">
      <span class="mr-4" id="label">{data.type}</span>
      <span style="color: var(--text-color2)">
        {Math.round(data.percentage)}%
      </span>
    </div>
    <span class="mx-4 text-xl font-bold">${Math.round(data.sum)}</span>
  </div>
  <div
    class="absolute left-0 top-0 h-full rounded-r opacity-25"
    in:scale={{ duration: 180, delay: index * 80 }}
    style="width: {((window.innerWidth <= 768 ? window.innerWidth : (window.innerWidth * 1) / 2) * data.percentage) / 100}px;
    background-color: {barColor}" />
</div>
