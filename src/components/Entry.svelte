<script>
  import {
    view,
    toastMessage,
    userInfo,
    entryData,
    dashboardShouldReload,
    overlay,
    detailData,
    filteredSearchData
  } from "../store/store";
  import { onMount, onDestroy } from "svelte";
  import TypeButton from "./TypeButton.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { typeDesigns, handleRouting, getDateString } from "../util";
  import { fly, fade } from "svelte/transition";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/storage";

  let scrolling = false;

  let description = "";
  let amount = 0;
  let date = getDateString();
  let type = "Food";
  let suggestedDescriptions = [];
  let gpsPlaces = [];
  let pictureFile;
  let picturePreview;
  let pictureURL;

  let amountValid = false;
  let dateValid = false;
  let typeValid = false;

  let isUpdate = false;

  let wrapperEl;

  const commonDescriptions = new Map([
    ["Food", ["GrabFood", "Foodpanda", "Lunch at Westgate", "Lunch at JEM"]],
    ["Groceries", ["NTUC", "Redmart"]],
    ["Transport", ["Grabcar", "Taxi"]],
    ["Household", ["Cleaner", "Kid's clothes", "Diapers"]],
    ["Utilities", ["Internet", "Electricity", "Gas/Water"]]
  ]);

  onMount(() => {
    //Use existing data to be edited if user came from Detail view
    if (Object.keys($entryData).length > 0) {
      isUpdate = true;

      description = $entryData.desc;
      amount = $entryData.amount;
      date = $entryData.date;
      type = $entryData.type;
      pictureURL = $entryData.pictureURL;

      document.getElementById("today-button").classList.remove("active");
      document.getElementById("yesterday-button").classList.remove("active");

      if (pictureURL) {
        document
          .getElementById("picture-button")
          .style.setProperty("color", "hsl(var(--secondary-hue), 50%, 50%)");
      }
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
      date = getDateString();
      document.getElementById("today-button").classList.add("active");
      document.getElementById("yesterday-button").classList.remove("active");
    } else if (dateToSet === "yesterday") {
      const yesterday = new Date(Date.now() - 86400000);
      const _year = yesterday.getFullYear();
      const _month = yesterday.getMonth() + 1;
      const _date = yesterday.getDate();

      date = getDateString(_year, _month, _date);
      document.getElementById("yesterday-button").classList.add("active");
      document.getElementById("today-button").classList.remove("active");
    }
  }

  function receiveType(e) {
    type = e.detail.selectedType;
  }

  function uploadPictureAndFirestore() {
    const storage = firebase
      .storage()
      .ref()
      .child("expense_pics/" + pictureFile.name);

    storage
      .put(pictureFile)
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          pictureURL = url;
          writeToFirestore();
        });
      })
      .catch(error => {
        toastMessage.set(error.message);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  function writeToFirestore() {
    const db = firebase.firestore();
    const newId = Date.now().toString() + amount;

    let _pictureURL, _pictureName;

    if (pictureFile) {
      _pictureURL = pictureURL;
      _pictureName = pictureFile.name;
    } else if (pictureURL && !pictureFile) {
      _pictureURL = pictureURL;
      _pictureName = $entryData.pictureName;
    } else {
      _pictureURL = "";
      _pictureName = "";
    }

    db.collection("expenses")
      .doc($entryData.id ? $entryData.id : newId)
      .set({
        amount: amount,
        date: date,
        desc: description,
        type: type,
        addedBy: $userInfo.name,
        addedOn: getDateString(),
        id: $entryData.id ? $entryData.id : newId,
        pictureURL: _pictureURL,
        pictureName: _pictureName
      })
      .then(() => {
        toastMessage.set("Expense created!");
        setTimeout(() => toastMessage.set(""), 1000);
        dashboardShouldReload.set(true);
      })
      .catch(error => {
        toastMessage.set(error.message);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  function sendEntry() {
    handleRouting("dashboard");
    view.set("dashboard");
    overlay.set("");

    toastMessage.set("Submitting...");

    if (pictureFile) {
      uploadPictureAndFirestore();
    } else {
      writeToFirestore();
    }
  }

  function deleteEntry() {
    handleRouting("dashboard");
    overlay.set("");

    const db = firebase.firestore();
    db.collection("expenses")
      .doc($entryData.id)
      .delete()
      .then(() => {
        if ($entryData.pictureURL) {
          const picture = firebase
            .storage()
            .ref()
            .child("expense_pics/" + $entryData.pictureName);

          picture
            .delete()
            .then(() => {
              toastMessage.set("Entry deleted");
              setTimeout(() => toastMessage.set(""), 1000);
              dashboardShouldReload.set(true);
            })
            .catch(error => {
              toastMessage.set(error.message);
              setTimeout(() => toastMessage.set(""), 1000);
            });
        } else {
          toastMessage.set("Entry deleted");
          setTimeout(() => toastMessage.set(""), 1000);
          dashboardShouldReload.set(true);
        }
      })
      .catch(error => {
        toastMessage.set(error);
        setTimeout(() => toastMessage.set(""), 3000);
      });
  }

  function getLocation() {
    if (navigator.geolocation) {
      document
        .getElementById("location-button")
        .style.setProperty("color", "hsl(var(--accent-hue), 50%, 50%)");

      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const long = pos.coords.longitude;

          const query = `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?types=poi&limit=5&access_token=pk.eyJ1IjoiY2VyaXZpdG9zIiwiYSI6ImNrNjloN2VudjBla2Iza3BrejRwNGJvMGUifQ.ZHcdvLfvzTjpZtAT0vAvaQ`;

          gpsPlaces = [];

          fetch(query)
            .then(response => response.json())
            .then(parsed => {
              parsed.features.forEach(place => gpsPlaces.push(place.text));

              suggestedDescriptions = [...gpsPlaces, ...suggestedDescriptions];
            });
        },
        error => {
          document
            .getElementById("location-button")
            .style.setProperty("color", "var(--text-color2)");

          toastMessage.set(error.message);
          setTimeout(() => toastMessage.set(""), 3000);
        },
        {
          timeout: 500,
          enableHighAccuracy: true
        }
      );
    } else {
      toastMessage.set("Unable to get your location");
      setTimeout(() => toastMessage.set(""), 3000);
    }
  }

  function getPicture(result) {
    pictureFile = result.target.files[0];

    if (!pictureFile.type.match(/^image\//)) {
      toastMessage.set("Please select an image file!");
      setTimeout(() => toastMessage.set(""), 3000);
    } else if (pictureFile.size > 5242880) {
      toastMessage.set("Pictures must be less than 5mb!");
      setTimeout(() => toastMessage.set(""), 3000);
    } else {
      document
        .getElementById("picture-button")
        .style.setProperty("color", "hsl(var(--secondary-hue), 50%, 50%)");

      picturePreview = URL.createObjectURL(pictureFile);
    }
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
    suggestedDescriptions = commonDescriptions.get(type);
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

  #date-input {
    @apply w-auto;
  }

  #description-input {
    @apply text-lg font-normal;
  }

  .label {
    @apply text-2xl font-bold ml-4 mr-2 w-1/3;
    color: var(--text-color);
  }

  .label-error:after {
    content: "•";
    @apply relative ml-2 mb-4 text-red-600;
  }

  .input-row {
    @apply flex flex-row w-full justify-between items-center mt-12;
  }

  .input-row.description-row-small {
    @apply flex-col items-start;
  }

  .description-row-small input {
    @apply text-left p-0 mr-2;
  }

  .date-button {
    @apply rounded-full px-3 py-1 font-bold;
    transition: background-color 120ms;
    color: var(--text-color2);
    background-color: var(--inactive-button-color);
  }

  .date-button.active {
    background-color: hsl(var(--secondary-hue), 50%, 50%);
    color: whitesmoke;
  }

  .form-wrapper {
    @apply flex flex-col w-full;
  }

  .suggestion-button {
    @apply rounded-full px-3 py-1 self-start mr-2 mt-2 truncate;
    color: var(--text-color2);
    background-color: var(--inactive-button-color);
    transition: background-color 250ms ease-out;
  }

  .submit-button {
    @apply rounded-full px-4 py-2 text-white text-2xl font-bold w-4/5 mt-24 mb-8 bg-gray-300;
    transition: background-color 250ms ease-out;
  }

  .submit-button.active {
    background-color: hsl(var(--accent-hue), 50%, 50%);
  }

  .submit-button.inactive {
    background-color: hsl(var(--accent-hue), 50%, 50%);
    opacity: 0.3;
  }

  .submit-button:hover {
    background-color: hsl(var(--accent-hue), 70%, 55%);
    transition: background-color 250ms ease-out;
  }

  .submit-button:active {
    background-color: hsl(var(--accent-hue), 70%, 45%);
    transition: background-color 80ms ease-out;
  }

  .suggestion-button:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.4);
    transition: background-color 120ms ease-out;
  }

  .suggestion-button:hover {
    background-color: hsl(var(--secondary-hue), 30%, 85%, 0.4);
    transition: background-color 120ms ease-out;
  }

  .sign-out-button {
    @apply py-2 text-red-600 rounded-full px-4 mb-8 text-center w-1/4;
    background-color: transparent;
    transition: background-color 120ms ease-out;
  }

  .sign-out-button:hover {
    background-color: hsla(var(--secondary-hue), 30%, 85%, 0.2);
    transition: background-color 120ms ease-out;
  }

  .sign-out-button:active {
    background-color: hsla(var(--secondary-hue), 30%, 75%, 0.4);
    transition: background-color 80ms ease-in;
  }

  @media only screen and (min-width: 768px) {
    .form-wrapper {
      @apply w-6/12;
    }
  }
</style>

<div
  id="entry-page"
  class="h-screen w-full absolute top-0 overflow-y-auto overflow-x-hidden"
  style="background-color: var(--background-color); color: var(--text-color)"
  out:fade={{ duration: 80 }}>
  <div
    class="w-full flex flex-row p-4 {scrolling ? 'shadow' : ''} fixed top-0
    justify-between z-10"
    style="height: 56px; background-color: var(--background-color)">
    <button>
      <i
        class="material-icons-round fill-current"
        style="color: hsl(var(--primary-hue), 50%, 50%)"
        aria-label="Back button"
        on:click={() => {
          window.history.back();
        }}>
        arrow_back
      </i>
    </button>
  </div>
  <div class="flex flex-col items-center justify-around mt-8">
    <div class="form-wrapper">
      <div class="input-row" in:fade={{ duration: 120, delay: 30 }}>
        <label
          for="amount-input"
          class={amountValid ? 'label' : 'label label-error'}>
          Amount
        </label>
        <input
          id="amount-input"
          class="amount text-2xl"
          type="number"
          min="0"
          bind:value={amount}
          on:click={() => document.execCommand('selectall', null, false)} />
      </div>
      <div class="input-row" in:fade={{ duration: 120, delay: 60 }}>
        <label
          for="date-input"
          class={dateValid ? 'label' : 'label label-error'}>
          Date
        </label>
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
        ml-4"
        style="color: var(--text-color2)"
        in:fade={{ duration: 80, delay: 90 }}>
        <span>Other date</span>
        <input id="date-input" type="date" bind:value={date} />
      </div>
      <div class="mt-12 flex flex-col" in:fade={{ duration: 120, delay: 150 }}>
        <label class="label">Type</label>
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
        class="input-row {window.innerWidth < 768 ? 'description-row-small' : ''}"
        in:fade={{ duration: 120, delay: 120 }}>
        <label for="description-input" class="label">Description</label>
        <div class="flex w-full justify-between items-center px-4 mt-2">
          <input
            class="truncate text-2xl flex-grow"
            id="description-input"
            type="text"
            placeholder="(Optional)"
            bind:value={description}
            on:click={() => document.execCommand('selectall', null, false)} />
          <button on:click={() => getLocation()}>
            <i
              id="location-button"
              class="material-icons-round fill-current mr-4"
              style="color: var(--text-color2)">
              location_on
            </i>
          </button>
          <input
            id="picture-input"
            type="file"
            name="image"
            accept="image/*"
            style="display:none"
            on:change={result => getPicture(result)} />
          <button
            on:click={() => document.getElementById('picture-input').click()}>
            <i
              id="picture-button"
              class="material-icons-round fill-current"
              style="color: var(--text-color2)">
              photo_camera
            </i>
          </button>
        </div>
      </div>
      {#if picturePreview || pictureURL}
        <img
          id="picture-preview"
          alt={picturePreview ? picturePreview : pictureURL}
          in:fade
          class="object-cover h-64 w-full mt-4"
          src={picturePreview ? picturePreview : pictureURL} />
      {/if}
      <div class="flex mt-4 mx-4 flex-wrap">
        {#if suggestedDescriptions}
          {#each suggestedDescriptions as suggestion, index (suggestion)}
            <button
              class="suggestion-button"
              in:fade={{ duration: 180, delay: 30 * index }}
              on:click={() => (description = suggestion)}>
              {suggestion}
            </button>
          {/each}
        {/if}
      </div>
      <div
        class="w-full text-center block"
        in:fade={{ duration: 120, delay: 180 }}>
        <button
          class="submit-button {typeValid && dateValid && amountValid ? 'active' : 'inactive cursor-not-allowed'}"
          disabled={!(typeValid && dateValid && amountValid)}
          on:click={() => sendEntry()}>
          {isUpdate ? 'Update' : 'Submit'}
        </button>
      </div>
      {#if Object.keys($entryData).length > 0}
        <div class="w-full text-center">
          <button class="sign-out-button" on:click={() => deleteEntry()}>
            Delete
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
