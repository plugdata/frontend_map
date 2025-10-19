"use client"

import { useEffect } from 'react'
import '../styles/globals.css'
import "leaflet/dist/leaflet.css"
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Import Bootstrap CSS
    import('bootstrap/dist/css/bootstrap.min.css')
    // Import Font Awesome
    import('@fortawesome/fontawesome-free/css/all.min.css')
    
    // Note: Leaflet will be loaded dynamically in the map component
    // to avoid server-side rendering issues
  }, [])

  return <Component {...pageProps} />
}

export default MyApp 