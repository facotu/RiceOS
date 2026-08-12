import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RiceOS - Hệ Thống Cân Lúa Thông Minh',
    short_name: 'RiceOS',
    description: 'Ứng dụng quản lý cân lúa ngoài đồng ruộng hỗ trợ di động, Supabase và Vercel',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1a12',
    theme_color: '#16a34a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  };
}
