import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Scrolling is handled by the app (components/ScrollToTop.jsx): pages open at the top, or at
// the section named in the URL. Without this the browser would restore the old position on
// reload before the page has rendered, landing part-way down.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
