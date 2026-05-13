// Electron renderer polyfills
// This file must be imported at the very top of layout.js

if (typeof window !== 'undefined') {
  // Fix #1: "global is not defined" error
  window.global = window;
  
  // Fix #2: globalThis reference
  window.globalThis = window;
  
  // Fix #3: process.env for libraries that expect it
  if (!window.process) {
    window.process = { 
      env: { 
        NODE_ENV: 'production',
        NEXT_PUBLIC_ELECTRON_MODE: 'true'
      } 
    };
  }
  
  // Fix #4: Buffer for libraries that need it
  if (typeof Buffer === 'undefined' && window.Buffer) {
    window.Buffer = window.Buffer;
  }
  
  // Fix #5: console.log to confirm polyfill loaded (remove in production)
  console.log('✅ Electron polyfill loaded - global, globalThis, process.env available');
}