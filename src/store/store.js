import { writable } from "svelte/store";

//ui state - 'settings' or 'dashboard'
export const view = writable("dashboard");
//ui state (separate from above so that the settings or dashboard page is not destroyed when showing entry or detail page) - 'entry' or 'detail'
export const overlay = writable("");

//Handle passing of data for Detail page
export const detailData = writable({});

//Message to show in toast
export const toastMessage = writable("");

//user info
export const userInfo = writable({});
