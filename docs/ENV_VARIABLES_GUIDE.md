# Environment Variables Setup Guide

## Overview

The Moodboard Webapp uses environment variables to configure optional features like image search, audio providers, and weather integration.

## Setup

1. Create a `.env` file in the project root
2. Copy the variables below and add your API keys
3. Restart the development server

## Variables

```bash
# ===== Image Search Providers (Optional) =====
# These are optional - the app works without them, but image search will be disabled

# Unsplash API (https://unsplash.com/developers)
# Free tier: 50 requests/hour
VITE_IMAGE_UNSPLASH_KEY=your_key_here

# Pexels API (https://www.pexels.com/api/)
# Free tier: 200 requests/hour
VITE_IMAGE_PEXELS_KEY=your_key_here

# Pixabay API (https://pixabay.com/api/docs/)
# Free tier: Unlimited requests
VITE_IMAGE_PIXABAY_KEY=your_key_here

# ===== Audio Providers (Optional) =====
# For ambient sound feature in customer view

# Pixabay Audio API
VITE_AUDIO_PIXABAY_KEY=your_key_here

# Freesound.org API (https://freesound.org/apiv2/)
VITE_AUDIO_FREESOUND_KEY=your_key_here

# ===== Weather Integration (Optional) =====
# For timeline weather forecast feature
# OpenWeatherMap API (https://openweathermap.org/api)
# Free tier: 60 calls/minute, 1,000,000 calls/month
VITE_WEATHER_API_KEY=your_openweathermap_key

# ===== Public Base URL =====
# Used for generating shareable links
# For local development:
VITE_PUBLIC_BASE_URL=http://localhost:3000
# For production (Vercel):
# VITE_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## Getting API Keys

### Unsplash
1. Go to https://unsplash.com/developers
2. Create a new application
3. Copy the "Access Key"

### Pexels
1. Go to https://www.pexels.com/api/
2. Sign up for free
3. Get your API key from the dashboard

### Pixabay
1. Go to https://pixabay.com/api/docs/
2. Sign up and get your API key

### OpenWeatherMap
1. Go to https://openweathermap.org/api
2. Sign up for free
3. Generate an API key
4. Wait ~10 minutes for activation

## Without API Keys

The app works perfectly without any API keys! You can:
- Upload your own images
- Use the asset library
- Create checklists and timelines
- All core features work

API keys only enable:
- Web image search
- Ambient audio
- Weather forecasts for timeline

