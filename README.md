<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&size=32&duration=3000&pause=1000&color=10B981&center=true&vCenter=true&width=600&height=70&lines=RoomFinder;Next.js+16+App+Router;Supabase+%26+Postgres;Zero-Brokerage+Rentals" alt="RoomFinder Typing Banner" />
</p>

<p align="center">
  <strong>A high-performance, zero-brokerage rental property discovery platform built with a dark glassmorphic interface.</strong>
</p>

<p align="center">
  <a href="#-features-grid">Features</a> •
  <a href="#%EF%B8%8F-technical-architecture">Architecture</a> •
  <a href="#-security-model">Security Model</a> •
  <a href="#%EF%B8%8F-installation--setup">Setup Guide</a> •
  <a href="#-future-roadmap">Roadmap</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/react%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
</p>

---

## 🌟 Value Proposition

Finding a room shouldn't come with a premium middleman tax. **RoomFinder** solves this by connecting tenants directly with property owners. Featuring instant peer-to-peer phone access, responsive visual carousels, and an isolated, secure owner administration cockpit, it is the modern answer to rental discovery.

---

## 🚀 Features Grid

| 👤 Tenant Experience | 💼 Owner Experience |
| :--- | :--- |
| **Instant Search & Filters:** Filter properties seamlessly by area, landmark, rent constraints, property layouts, and tenant compatibility. | **Secure CRUD Cockpit:** Create, view, edit, and safely delete listings from a single, responsive dashboard. |
| **Instant Peer-to-Peer Dialing:** Direct `tel:` links to property owners, enabling single-click communication on mobile viewports. | **Multi-Image Storage Pipeline:** Multi-file drag-and-drop uploads directly to Supabase storage with automatic extension filters. |
| **Smooth Visual Carousels:** Glide through high-resolution property galleries with interactive layout indicators. | **Isolated Data Safeguards:** RLS-backed transactions restrict listings so only the authentic owner can mutate or delete their entries. |

---

## 🏗️ Technical Architecture

RoomFinder relies on a highly responsive, unified SSR-CSR hybrid data loop that leverages Next.js App Router and Supabase BaaS:

```
┌───────────────────────────────────────────────────────────────────┐
│                           Client Browser                          │
│        (Next.js Client Components, Toast Context, Interactive UI)  │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                  HTTPS Requests / Cookie Sync
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                        Next.js Server Layer                       │
│     (App Router, React Server Components, Server-Side Cookie Auth)│
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                     Supabase SDK Operations
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                       Supabase Backend Services                   │
│     (Auth & JWT Manager ➔ PostgreSQL Database ➔ Storage Bucket)   │
└───────────────────────────────────────────────────────────────────┘
```

- **RSC Data Loading:** Public listings (`/rooms`) and dashboards (`/owner/rooms`) fetch directly from Supabase within React Server Components. This completely eliminates loading states, enhances SEO performance, and secures database calls.
- **Unified Auth Exchange:** Next.js uses middleware and `@supabase/ssr` to dynamically retrieve auth sessions from server-side cookies, sharing authentication state securely between the browser and edge servers.

---

## 🔒 Security Model

Data security is built directly into RoomFinder’s database schema using PostgreSQL **Row Level Security (RLS)**.

### Row Level Security (RLS) Policies
Rather than relying on vulnerable API validation endpoints, the system delegates security checks directly to PostgreSQL:

```sql
-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- 1. Enable public read access for all visitors
CREATE POLICY "Public Read Access" ON rooms
    FOR SELECT USING (true);

-- 2. Restrict row insertions to logged-in users matching their own ID
CREATE POLICY "Authenticated Owner Insert" ON rooms
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 3. Restrict updates and deletions exclusively to the row's owner
CREATE POLICY "Owner Mutation Control" ON rooms
    FOR ALL USING (auth.uid() = owner_id);
```

### Storage Bucket Security (`room-images`)
- **Read Operations:** Set as a public bucket to allow instant image loading for listing galleries.
- **Write Operations:** Bucket write policies constrain file paths to standard patterns (e.g. `bucket/owner_id/filename`), ensuring authenticated owners can only upload to, and delete from, their own directories.

---

## ⚙️ Installation & Setup

Get RoomFinder running locally in minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/Sudarshan25092007/Room-Finder-Web.git
cd Room-Finder-Web
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Configure Local Environment Variables
Create a `.env.local` (or edit your existing `.env`) in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 4. Boot Up the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to explore.

---

## 🗺️ Future Roadmap

- [ ] **Next-Gen Image Processing:** Integrate `next/image` in `ImageCarousel` and `RoomCard` for automatic WebP conversion and responsive viewports.
- [ ] **Interactive Maps:** Embed an interactive Mapbox canvas to pinpoint room locations.
- [ ] **Real-Time Tenant Messaging:** Build an in-app messaging terminal using Supabase Realtime tables.
- [ ] **Search Auto-Suggestions:** Integrate search autocomplete matching regional landmarks.

---

<p align="center">
  Developed with ❤️ by <strong>Sudarshan Patil H J</strong>
</p>

<p align="center">
  <a href="https://github.com/Sudarshan25092007">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/sudarshan-patil-h-j">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>
