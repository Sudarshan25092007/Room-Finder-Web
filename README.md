# RoomFinder – Rental Room Finder

RoomFinder is a full-stack web application that helps users discover rental rooms and allows owners to manage their listings efficiently. Built using Next.js App Router and Supabase (Auth, Database, Storage).

Developed by **Sudarshan Patil H J**.

---

## 🚀 Features

### 🔍 Browse Rooms
- Filter rooms by **location**, rent range, property type, and tenant preference.
- Responsive grid layout with image slideshow.
- Detailed room page with image carousel and **direct call button** to the owner.

### 🧑‍💼 Owner Dashboard
- Secure signup and login (email + password).
- Create, edit, and delete room listings.
- Upload multiple room images using Supabase Storage.
- **My Rooms** section showing only the logged-in owner’s listings.

### 🔐 Authentication & Data
- Supabase authentication.
- PostgreSQL `rooms` table with **Row Level Security (RLS)** based on `owner_id`.
- Public storage bucket (`room-images`) for room photos.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS  
- **Backend & Data:** Supabase (Auth, Postgres, Storage)  
- **Styling:** Tailwind CSS, custom UI components  
- **Deployment:** Vercel  

---

## 👨‍💻 Developer

**Name:** Sudarshan Patil H J  
**Role:** Full-Stack / MERN Stack Developer  
**Focus Areas:**  
- Full-stack web applications  
- React & Next.js  
- REST APIs & authentication  
- Cloud databases (Supabase, MongoDB)
