import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Akbari Savings',
    short_name: 'Akbari',
    description: 'Securely manage and track your savings with the Akbari Savings platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#18181b',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
