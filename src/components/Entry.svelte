<script>
  import {
    view,
    toastMessage,
    userInfo,
    entryData,
    dashboardShouldReload,
    overlay,
    detailData
  } from "../store/store";
  import { onMount, onDestroy } from "svelte";
  import TypeButton from "./TypeButton.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { typeDesigns, handleRouting } from "../util";
  import { fly, fade } from "svelte/transition";
  import firebase from "firebase/app";
  import "firebase/firestore";

  let scrolling = false;

  let description = "";
  let amount = 0;
  let date = new Date().toISOString().substring(0, 10);
  let type = "Food";

  let amountValid = false;
  let dateValid = false;
  let typeValid = false;

  let isUpdate = false;

  let wrapperEl;

  onMount(() => {
    //Use existing data to be edited if user came from Detail view
    if (Object.keys($entryData).length > 0) {
      isUpdate = true;

      description = $entryData.desc;
      amount = $entryData.amount;
      date = $entryData.date;
      type = $entryData.type;

      document.getElementById("today-button").classList.remove("active");
      document.getElementById("yesterday-button").classList.remove("active");
    }

    wrapperEl = document.getElementById("entry-page");
    wrapperEl.addEventListener("scroll", ev => {
      ev.target.scrollTop > 0 ? (scrolling = true) : (scrolling = false);
    });

    //Remove higlight for Today and Yesterday date shortcut buttons since user wants to enter own date
    document.getElementById("date-input").oninput = () => {
      document.getElementById("today-button").classList.remove("active");
      document.getElementById("yesterday-button").classList.remove("active");
    };

    //Get focus on Amount input field
    document.getElementById("amount-input").focus();
    document.getElementById("amount-input").select();
  });

  onDestroy(() => {
    entryData.set({});
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

  function sendEntry() {
    window.history.back();
    toastMessage.set("Submitting...");

    const db = firebase.firestore();
    db.collection("expenses")
      .doc($entryData.id ? $entryData.id : Date.now().toString() + amount)
      .set({
        amount: amount,
        date: date,
        desc: description,
        type: type,
        addedBy: $userInfo.name,
        addedOn: new Date().toISOString().substring(0, 10),
        id: $entryData.id ? $entryData.id : Date.now().toString() + amount
      })
      .then(() => {
        toastMessage.set("Expense created!");
        setTimeout(() => toastMessage.set(""), 1000);
        dashboardShouldReload.set(true);
      })
      .catch(error => {
        toastMessage.set(error);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  function deleteEntry() {
    handleRouting("dashboard");
    overlay.set("");

    const db = firebase.firestore();
    db.collection("expenses")
      .doc($entryData.id)
      .delete()
      .then(() => {
        toastMessage.set("Entry deleted");
        setTimeout(() => toastMessage.set(""), 1000);
        dashboardShouldReload.set(true);
      })
      .catch(error => {
        toastMessage.set(error);
        setTimeout(() => toastMessage.set(""), 3000);
      });
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
  #entry-wrapper::-webkit-scrollbar {
    display: none;
  }

  input {
    outline: none !important;
    @apply px-2 py-1 mr-4 w-2/3 appearance-none text-right font-bold text-gray-600 bg-transparent;
  }

  #description-input {
    @apply text-lg font-normal;
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
  id="entry-page"
  class="h-screen w-full bg-white absolute top-0 overflow-auto"
  out:fade={{ duration: 80 }}>
  <div
    class="w-full flex flex-row p-4 bg-white {scrolling ? 'shadow' : ''} fixed
    top-0 justify-between z-20"
    style="height: 56px">
    <i
      class="material-icons fill-current"
      style="color: hsl(var(--primary-hue), 50%, 50%)"
      aria-label="Back button"
      on:click={() => {
        window.history.back();
      }}>
      arrow_back
    </i>
  </div>
  <div
    class="flex flex-col items-start justify-around bg-white mt-8"
    style="border-top-left-radius: 1rem; border-top-right-radius: 1rem">
    <div class="input-row" in:fade={{ duration: 120, delay: 30 }}>
      <label for="amount-input">Amount</label>
      <input
        id="amount-input"
        class="amount text-2xl"
        type="number"
        min="0"
        bind:value={amount}
        on:click={() => document.execCommand('selectall', null, false)} />
    </div>
    <div class="input-row" in:fade={{ duration: 120, delay: 60 }}>
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
      text-gray-600 ml-4"
      in:fade={{ duration: 80, delay: 90 }}>
      <span>Other date</span>
      <input id="date-input" type="date" bind:value={date} />
    </div>
    <div class="input-row" in:fade={{ duration: 120, delay: 120 }}>
      <label for="description-input">Description</label>
      <input
        class="truncate text-2xl"
        id="description-input"
        type="text"
        placeholder="(Optional)"
        bind:value={description}
        on:click={() => document.execCommand('selectall', null, false)} />
    </div>
    <div class="mt-8 flex flex-col" in:fade={{ duration: 120, delay: 150 }}>
      <label>Type</label>
      <div class="w-full flex flex-row flex-wrap justify-start">
        {#each typeDesigns as typeDesign}
          <TypeButton
            label={typeDesign.type}
            colorHue={typeDesign.hue}
            on:dispatchType={receiveType}
            isActive={type === typeDesign.type}
            materialIcon={typeDesign.materialIcon} />
        {/each}
      </div>
    </div>
    <div
      class="w-full text-center block"
      in:fade={{ duration: 120, delay: 180 }}>
      <button
        class="rounded-full px-4 py-2 text-white text-2xl font-bold w-4/5 mt-12
        mb-8 bg-gray-300"
        on:click={() => sendEntry()}
        style={typeValid && dateValid && amountValid ? 'background-color:hsl(var(--accent-hue), 50%, 50%)' : ''}>
        {isUpdate ? 'Update' : 'Submit'}
      </button>
    </div>
    {#if Object.keys($entryData).length > 0}
      <button
        class="w-full text-center mb-8 bg-transparent text-red-600"
        on:click={() => deleteEntry()}>
        Delete
      </button>
    {/if}
  </div>
</div>
