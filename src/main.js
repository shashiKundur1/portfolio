import { mount } from 'svelte'
import './lib/styles/theme.css'
import './lib/styles/global.css'
import App from './App.svelte'

const target = document.getElementById('app')
if (!target) throw new Error('Missing #app mount target')

mount(App, { target })
