import { writable } from "svelte/store";

//ui state - 'entry' or 'dashboard'
export const view = writable("dashboard");
export const toastMessage = writable("");

//user info
export const userInfo = writable({});
