# AI Trip Planner

This project now runs as a MERN-style app:

- Next.js/React frontend on `http://localhost:3000`
- Express API on `http://localhost:5000`
- MongoDB persistence when `MONGODB_URI` is configured
- In-memory fallback storage when MongoDB is not available

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in any keys you want to use.

Optional environment variables:

- `MONGODB_URI`: enables MongoDB persistence
- `GROQ_API_KEY`: enables AI itinerary generation through Groq
- `UNSPLASH_ACCESS_KEY`: enables destination image search through Unsplash

If you skip those keys, the app still runs with:

- generated fallback itineraries
- seeded placeholder images
- in-memory trip storage

## Run Locally

```bash
npm run dev
```

That starts both the frontend and the Express backend together.

## Available Scripts

- `npm run dev`: start Next.js and Express in development
- `npm run build`: build the Next.js frontend
- `npm run start`: start the built frontend and the Express API
- `npm run start:server`: run only the Express API
- `npm run start:client`: run only the Next.js frontend
