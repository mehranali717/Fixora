# Notes & common troubleshooting


- If Tailwind styles don't show: make sure `index.css` is imported in `src/main.jsx` and `tailwind.config.cjs` content paths include `./index.html` and `./src/**/*`.
- If you see a blank page: open browser console for errors. Most common cause is wrong import paths or missing `ReactDOM.createRoot` usage.
- Recommended Node version: 20+