import { mount } from 'svelte'
import './lib/styles/theme.css'
import './lib/styles/global.css'
import App from './App.svelte'

mount(App, {
  target: document.getElementById('app'),
})
