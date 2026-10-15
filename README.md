# 🐐 The GOAT's — CR7 Cinematic Tribute

An Awwwards-grade cinematic tribute to Cristiano Ronaldo. Built with Next.js 14, GSAP, Framer Motion, and Web Audio API.

## Features

- Cinematic preloader with SVG self-drawing CR7 monogram
- Custom physics cursor with golden dust trail
- 7-era horizontal scroll timeline with real-time palette morphing
- Iconic moments masonry gallery with 3D tilt
- Trophy cabinet with 3D flip cards
- Goal reel with YouTube video modal
- The Cyborg Lab: biometrics, knuckleball physics, recovery dial
- Full admin panel at /admin (password protected)
- Media library at /admin/media
- Live edit mode: change images, colors, text without code

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build

```bash
npm run build
npm run start
```

## Deployment on Render

This project is configured for deployment using `render.yaml`. Configure your environment variables in your Render service dashboard:

- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://your-app.onrender.com`)
- `NEXT_PUBLIC_ADMIN_PASSWORD`: Your secret admin password
