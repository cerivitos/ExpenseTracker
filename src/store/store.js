import { writable } from "svelte/store";

//ui state - 'settings' or 'dashboard'
export const view = writable("dashboard");

//ui state (separate from above so that the settings or dashboard page is not destroyed when showing entry or detail page) - 'entry', 'detail' or 'search'
export const overlay = writable("");
export const dashboardShouldReload = writable(false);

//Handle passing of search query string to allow highlighting in DetailListTile
export const queryString = writable("");

//Handle passing of data for Detail page
export const detailData = writable({});

//Handle passing of data to Entry page for editing
export const entryData = writable({});

//Message to show in toast
export const toastMessage = writable("");

//user info
export const userInfo = writable({});
