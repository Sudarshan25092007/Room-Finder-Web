# RoomFinder – Rental Room Finder

RoomFinder is a full‑stack web app to browse rental rooms and let owners manage their listings. Built with Next.js App Router and Supabase (Auth, DB, Storage).

Developed by **Sudarshan Patil H J** (MERN Stack Developer && Full Stack Developer).

## Features

- 🔍 **Browse rooms**
  - Filter by location, rent range, property type, and tenant preference.
  - Responsive grid of room cards with image slideshow.
  - Room details page with large image carousel and direct call button.

- 🧑‍💼 **Owner dashboard**
  - Login / signup with email + password.
  - Create, edit, and delete room listings.
  - Upload multiple images per room to Supabase Storage.
  - “My Rooms” page showing only the logged‑in owner’s rooms.

- 🔐 **Auth & data**
  - Supabase authentication.
  - Rooms stored in a `rooms` table with RLS rules based on `owner_id`.
  - Public bucket `room-images` for room photos.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend & Data:** Supabase (Auth, Postgres, Storage)
- **Styling:** Tailwind, custom UI components
- **Deployment:** Vercel

## Developer

**Name:** Sudarshan Patil H J  
**Role:** MERN Stack Developer  
**Focus Areas:** Full‑stack web apps and Mobile Application (React / Next.js, Node.js), REST APIs, authentication, and cloud databases (Supabase / MongoDB).

