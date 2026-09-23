import { mount } from 'svelte';
import App from './App.svelte';

// Mount Svelte 5 App into frame container or body
const target = document.getElementById('svelte-frame-root') || document.body;
const app = mount(App, {
  target
});

export default app;
