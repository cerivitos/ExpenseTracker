<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { queryString, entryData, overlay } from "../store/store";
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
      .indexOf(queryString);
    const endHighlightIndex = startHighlightIndex + queryString.length;

    return (
      textToHighlight.slice(0, startHighlightIndex) +
      '<span class="font-bold" style="color: hsl(var(--secondary-hue), 50%, 50%); background-color: hsl(var(--secondary-hue), 35%, 80%)">' +
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

<div
  class="flex flex-row p-4 items-center w-full cursor-pointer"
  style="background-color: var(--background-color); color: var(--text-color)"
  in:fade={{ duration: 120 }}
  out:fade={{ duration: 80 }}
  on:click={() => showEditDetail(data)}>
  <div
    id="icon"
    class="rounded-full p-2 mr-2 fill-current"
    style="background-color: {backgroundColor}; color:{iconColor}">
    <i class="material-icons md-18" style="display:block !important">
      {materialIcon}
    </i>
  </div>
  <div class="flex flex-col items-start mr-4">
    <span class="font-bold truncate mr-2">
      {@html addedBy}
    </span>
    <span class="truncate" style="color: var(--text-color2)">
      {@html desc}
    </span>
  </div>
  <span class="flex-grow flex justify-end font-bold text-xl">
    $
    {@html data.amount.toFixed(2)}
  </span>
</div>
