/** @type {import('tailwindcss').Config} */
/**
 * fluid function
 */
import { Fluid } from './src/apps/extra/math.js'
const daisyui = require('daisyui')

module.exports = {
  content: ["./src/**/*.{html,js,pug}"],
  theme: {
    container: {
      center: true,
      screens: {
        DEFAULT: '100%', 
        xl: '1440px',    
      },
    },
    extend: {
      fontSize: {        
        xxl: [Fluid(4, 200)], 
        xl: [Fluid(4, 120)], 
        lg: [], 
        md: [[Fluid(1.8, 2)]], 
        sm: [], 
        body: [], 
        input: [], 
        highlight: [Fluid(1.2, 1.2)], 
      },      
    },
  },
  plugins: [
    daisyui
  ],
  corePlugins: {
    preflight: true, /** Ensure it's enabled */
  },
}