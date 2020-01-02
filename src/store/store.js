import { writable } from "svelte/store";

//ui state - 'entry' or 'dashboard' or 'detail' or 'edit'
export const view = writable("dashboard");

//Handle passing of data  for Detail page and origin points of icon and label for hero animation
export const detailData = writable({});

//Message to show in toast
export const toastMessage = writable("");

//user info
export const userInfo = writable({});
