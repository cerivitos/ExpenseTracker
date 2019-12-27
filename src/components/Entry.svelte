<script>
  import { view } from "../store/store";
  import { onMount } from "svelte";
  import TypeButton from "./TypeButton.svelte";

  let description = "";
  let amount = 0;
  let date = new Date().toISOString().substring(0, 10);
  let type = "Food";

  let amountValid = false;
  let dateValid = false;
  let typeValid = false;

  onMount(() => {
    document.getElementById("amount-input").focus();
    document.execCommand("selectall", null, false);
  });

  function setDate(dateToSet) {
    if (dateToSet === "today") {
      date = new Date().toISOString().substring(0, 10);
      document.getElementById("today-button").classList.add("active");
      document.getElementById("yesterday-button").classList.remove("active");
    } else if (dateToSet === "yesterday") {
      date = new Date(Date.now() - 86400000).toISOString().substring(0, 10);
      document.getElementById("yesterday-button").classList.add("active");
      document.getElementById("today-button").classList.remove("active");
    }
  }

  function receiveType(e) {
    type = e.detail.selectedType;
  }

  $: if (amount <= 0 || amount === undefined) {
    amountValid = false;
  } else {
    amountValid = true;
  }

  $: if (date !== "") {
    dateValid = true;
  } else {
    dateValid = false;
  }

  $: if (type !== "") {
    typeValid = true;
  } else {
    typeValid = false;
  }
</script>

<style type="text/postcss">
  input {
    outline: none !important;
    @apply px-2 py-1 mr-4 w-2/3 appearance-none text-right font-bold text-gray-600;
  }

  .input-error {
    background-color: rgba(220, 20, 60, 0.2);
    box-shadow: 0 0 0 2px rgba(220, 20, 60) inset;
    color: rgba(220, 20, 60);
  }

  label {
    @apply text-gray-800 text-2xl font-bold ml-4 mr-2 w-1/3;
  }

  .input-row {
    @apply flex flex-row w-full justify-between items-center mt-8;
  }

  .date-button {
    @apply rounded-full bg-gray-300 text-white px-3 py-1 font-bold;
    transition: background-color 350ms;
  }

  .date-button.active {
    background-color: hsl(var(--secondary-hue), 50%, 50%);
  }

  .type-button {
    @apply rounded-full p-2 fill-current bg-gray-400 text-gray-800 mr-4 mt-4;
  }

  .type-button svg {
    @apply w-8 h-8;
  }
</style>

<div
  class="absolute top-0 w-full h-screen"
  style="background-color: rgba(0,0,0,0.2)">
  <div
    class="flex flex-col items-start justify-around bg-white mt-8"
    style="border-top-left-radius: 1rem; border-top-right-radius: 1rem">
    <div class="input-row">
      <label for="amount-input">Amount</label>
      <input
        id="amount-input"
        class="amount text-2xl"
        type="number"
        min="0"
        bind:value={amount}
        on:click={() => document.execCommand('selectall', null, false)} />
    </div>
    <div class="input-row">
      <label for="date-input">Date</label>
      <div class="mr-4">
        <button
          id="today-button"
          class="date-button active"
          on:click={() => setDate('today')}>
          Today
        </button>
        <button
          id="yesterday-button"
          class="date-button"
          on:click={() => setDate('yesterday')}>
          Yesterday
        </button>
      </div>
    </div>
    <div
      class="flex flex-row w-full justify-between items-center mt-2 text-lg
      text-gray-600 ml-4">
      <span>Other date</span>
      <input id="date-input" type="date" bind:value={date} />
    </div>
    <div class="input-row">
      <label for="description-input">Description</label>
      <input
        class="truncate text-2xl"
        id="description-input"
        type="text"
        placeholder="..."
        bind:value={description}
        on:click={() => document.execCommand('selectall', null, false)} />
    </div>
    <div class="mt-8 flex flex-col">
      <label>Type</label>
      <div class="w-full flex flex-row flex-wrap justify-start">
        <TypeButton
          label="Food"
          colorHue="170"
          on:dispatchType={receiveType}
          isActive={type === 'Food'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M16 6v6c0 1.1.9 2 2 2h1v7c0 .55.45 1 1 1s1-.45
            1-1V3.13c0-.65-.61-1.13-1.24-.98C17.6 2.68 16 4.51 16 6zm-5
            3H9V3c0-.55-.45-1-1-1s-1 .45-1 1v6H5V3c0-.55-.45-1-1-1s-1 .45-1
            1v6c0 2.21 1.79 4 4 4v8c0 .55.45 1 1 1s1-.45 1-1v-8c2.21 0 4-1.79
            4-4V3c0-.55-.45-1-1-1s-1 .45-1 1v6z" />
        </TypeButton>
        <TypeButton
          label="Groceries"
          colorHue="150"
          on:dispatchType={receiveType}
          isActive={type === 'Groceries'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM2
            4h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45
            1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41
            1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55
            0-1 .45-1 1s.45 1 1 1zm15 14c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9
            2-2-.9-2-2-2z" />
        </TypeButton>
        <TypeButton
          label="Transport"
          colorHue="130"
          on:dispatchType={receiveType}
          isActive={type === 'Transport'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M12 4H5C3.34 4 2 5.34 2 7v8c0 1.66 1.34 3 3
            3l-.77.77c-.28.28-.28.72 0 1s.72.28 1 0L7 18h2v-5H4.5c-.28
            0-.5-.22-.5-.5v-6c0-.28.22-.5.5-.5h8c.28 0
            .5.22.5.5V8h2V7c0-1.66-1.34-3-3-3zM5 14c.55 0 1 .45 1 1s-.45 1-1
            1-1-.45-1-1 .45-1 1-1zm15.57-4.34c-.14-.4-.52-.66-.97-.66h-7.19c-.46
            0-.83.26-.98.66l-1.42 4.11v5.24c0 .55.45.99 1 .99s1-.45 1-1v-1h8v1c0
            .55.45 1 1 1s.99-.44 1-.99L22 13.77l-1.43-4.11zm-7.8.34h6.48c.21 0
            .4.14.47.34l.69 2c.11.32-.13.66-.47.66h-7.85c-.34
            0-.58-.34-.47-.66l.69-2c.05-.2.24-.34.46-.34zM12 16c-.55
            0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55
            0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </TypeButton>
        <TypeButton
          label="Household"
          colorHue="110"
          on:dispatchType={receiveType}
          isActive={type === 'Household'}>
          <g id="Bounding_Box">
            <rect fill="none" width="24" height="24" />
            <rect fill="none" width="24" height="24" />
          </g>
          <g id="Master">
            <path
              d="M19,9.3V5c0-0.55-0.45-1-1-1h-1c-0.55,0-1,0.45-1,1v1.6l-3.33-3c-0.38-0.34-0.96-0.34-1.34,0l-8.36,7.53
              C2.63,11.43,2.84,12,3.3,12H5v7c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1v-5h4v5c0,0.55,0.45,1,1,1h3c0.55,0,1-0.45,1-1v-7h1.7
              c0.46,0,0.68-0.57,0.33-0.87L19,9.3z
              M10,10c0-1.1,0.9-2,2-2s2,0.9,2,2H10z" />
          </g>
        </TypeButton>
        <TypeButton
          label="Entertainment"
          colorHue="90"
          on:dispatchType={receiveType}
          isActive={type === 'Entertainment'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M21.5 4H18l1.74 2.61c.11.17-.01.39-.21.39h-2c-.33
            0-.65-.17-.83-.45L15 4h-2l1.74 2.61c.11.17-.01.39-.21.39h-2c-.33
            0-.65-.17-.83-.45L10 4H8l1.74 2.61c.11.17-.01.39-.21.39h-2c-.33
            0-.64-.17-.83-.45L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2
            2h16c1.1 0 2-.9 2-2V4.5c0-.28-.22-.5-.5-.5zM11.25 15.25L10
            18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75
            1.25zm5.69-3.31L16 14l-.94-2.06L13 11l2.06-.94L16 8l.94 2.06L19
            11l-2.06.94z" />
        </TypeButton>
        <TypeButton
          label="Healthcare"
          colorHue="70"
          on:dispatchType={receiveType}
          isActive={type === 'Healthcare'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9
            2-2V5c0-1.1-.9-2-2-2zm-2 11h-3v3c0 .55-.45 1-1 1h-2c-.55
            0-1-.45-1-1v-3H7c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h3V7c0-.55.45-1
            1-1h2c.55 0 1 .45 1 1v3h3c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1z" />
        </TypeButton>
        <TypeButton
          label="Utilities"
          colorHue="30"
          on:dispatchType={receiveType}
          isActive={type === 'Utilities'}>
          <path
            d="M11.45 5.55c.19.19.5.21.72.04C13.3 4.69 14.65 4.2 16 4.2s2.7.49
            3.84 1.39c.21.17.52.15.72-.04l.04-.05c.22-.22.21-.59-.03-.8C19.24
            3.57 17.62 3 16 3s-3.24.57-4.57
            1.7c-.24.21-.26.57-.03.8l.05.05zm1.7.76c-.25.2-.26.58-.04.8l.04.04c.2.2.5.2.72.04.63-.48
            1.38-.69 2.13-.69s1.5.21
            2.13.68c.22.17.53.16.72-.04l.04-.04c.23-.23.21-.6-.04-.8-.83-.64-1.84-1-2.85-1s-2.02.36-2.85
            1.01zM19 13h-2v-3c0-.55-.45-1-1-1s-1 .45-1 1v3H5c-1.1 0-2 .9-2 2v4c0
            1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM8 18H6v-2h2v2zm3.5
            0h-2v-2h2v2zm3.5 0h-2v-2h2v2z" />
        </TypeButton>
        <TypeButton
          label="Shopping"
          colorHue="10"
          on:dispatchType={receiveType}
          isActive={type === 'Shopping'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0
            1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3
            3H9c0-1.66 1.34-3 3-3zm0 10c-2.33
            0-4.29-1.59-4.84-3.75-.17-.63.32-1.25.97-1.25.47 0 .85.34.98.8.35
            1.27 1.51 2.2 2.89 2.2s2.54-.93 2.89-2.2c.13-.46.51-.8.98-.8.65 0
            1.13.62.97 1.25C16.29 11.41 14.33 13 12 13z" />
        </TypeButton>
        <TypeButton
          label="Travel"
          colorHue="250"
          on:dispatchType={receiveType}
          isActive={type === 'Travel'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M21 14.58c0-.36-.19-.69-.49-.89L13 9V3.5c0-.83-.67-1.5-1.5-1.5S10
            2.67 10 3.5V9l-7.51 4.69c-.3.19-.49.53-.49.89 0 .7.68 1.21 1.36 1L10
            13.5V19l-1.8 1.35c-.13.09-.2.24-.2.4v.59c0 .33.32.57.64.48L11.5
            21l2.86.82c.32.09.64-.15.64-.48v-.59c0-.16-.07-.31-.2-.4L13
            19v-5.5l6.64 2.08c.68.21 1.36-.3 1.36-1z" />
        </TypeButton>
        <TypeButton
          label="Gift"
          colorHue="230"
          on:dispatchType={receiveType}
          isActive={type === 'Gift'}>
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path
            d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05
            0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6
            3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2
            2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1
            1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1
            1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V9c0-.55.45-1
            1-1h4.08L7.6 10.02c-.33.45-.23 1.08.22 1.4.44.32 1.07.22 1.39-.22L12
            7.4l2.79 3.8c.32.44.95.54 1.39.22.45-.32.55-.95.22-1.4L14.92
            8H19c.55 0 1 .45 1 1v5z" />
        </TypeButton>
        <TypeButton
          label="Others"
          colorHue="190"
          on:dispatchType={receiveType}
          isActive={type === 'Others'}>
          <g fill="none">
            <path d="M0 0h24v24H0V0z" />
            <path opacity=".87" d="M0 0h24v24H0V0z" />
          </g>
          <path
            d="M4 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 4c.55 0
            1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-8c.55 0 1-.45
            1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm4 4h12c.55 0 1-.45
            1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0 4h12c.55 0 1-.45
            1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 8c0 .55.45 1 1
            1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm-3 5c.55 0 1-.45
            1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 4c.55 0 1-.45 1-1s-.45-1-1-1-1
            .45-1 1 .45 1 1 1zm0-8c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1
            1zm4 4h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0
            4h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 8c0
            .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z" />
        </TypeButton>
      </div>
    </div>
    <div class="w-full text-center block">
      <button
        class="rounded-full px-4 py-2 text-white text-2xl font-bold w-4/5 mt-12
        mb-8 bg-gray-300"
        style={typeValid && dateValid && amountValid ? 'background-color:hsl(var(--accent-hue), 50%, 50%)' : ''}>
        Submit
      </button>
    </div>
  </div>
</div>
