# Sondagar Estates — MERN Real Estate Website

A full-stack real estate site: Home, About, Blog (Journal), Properties, Property Detail
(gallery + location tag + sq.ft specs), an Enquiry form that emails a templated
acknowledgement, and an Admin Panel restricted to a single account (`sondagartom`)
for posting properties and blog entries.

## Stack
- **Backend:** Node, Express, MongoDB (Mongoose), JWT auth, Nodemailer
- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios

## Design
Palette: charcoal (`#12181B`), stone (`#EDE7DD`), brass (`#B08D57`), forest (`#2F3E36`).
Type: Fraunces (display) + Inter (body) + IBM Plex Mono (specs/prices — a nod to
blueprint annotation). Signature motif: thin architectural "corner bracket" frames
on hero imagery and property photos.

---

## 1. Backend Setup

```bash
cd backend
cp .env.example .env      # then edit values — see notes below
npm install
```

### Configure `.env`
- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the **only** login that can
  access `/admin`. Change the password before seeding.
- `SMTP_*` — an SMTP account (Gmail App Password, SendGrid, Mailgun, etc.) used to
  send the enquiry emails.
- `ADMIN_NOTIFY_EMAIL` — where new-enquiry notifications land.

### Create the one admin account
```bash
npm run seed:admin
```
This is idempotent — running it again just confirms the account already exists.
There's no public signup route by design, so this is the only way an admin account
gets created.

### Run the API
```bash
npm run dev      # nodemon, http://localhost:5000
# or
npm start
```

---

## 2. Frontend Setup

```bash
cd frontend
cp .env.example .env      # points at your backend, defaults to localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```

---

## 3. Using the Admin Panel

1. Go to `/admin/login` and sign in with the `sondagartom` credentials you seeded.
2. **Dashboard** (`/admin/dashboard`) lists all properties, blog posts, and incoming
   enquiries (with a status dropdown: New / Contacted / Closed).
3. **Add Property** (`/admin/properties/new`) — fill in title, price, location, sq.ft,
   bedrooms/bathrooms/parking, amenities, and image URLs (comma-separated; the first
   URL becomes the cover image). Mark "Featured" to surface it on the homepage.
4. **Add Blog Post** (`/admin/blogs/new`) — title, excerpt, content (plain text or
   basic HTML), cover image, category, tags.

Images: for a real deployment, swap the comma-separated URL fields for a proper
upload flow (e.g. `multer` + S3/Cloudinary) — the `multer` package is already listed
in `backend/package.json` to make that extension straightforward.

---

## 4. How the Enquiry Flow Works

- The `EnquiryForm` component is used two places:
  1. **Property Detail page** — pre-fills the message and links the enquiry to that
     specific property (`propertyId`).
  2. **About page** — a general enquiry, unlinked to any property.
- On submit, `POST /api/enquiry` saves the enquiry to MongoDB, then fires two emails
  via `backend/utils/mailer.js`:
  - one to **you** (`ADMIN_NOTIFY_EMAIL`) with the enquiry details,
  - one **generic auto-reply template** to the person who enquired, confirming
    receipt and echoing their message back to them.
- Edit the HTML template in `mailer.js` (`shell()` function) to restyle the emails —
  it already matches the site's charcoal/brass palette.

---

## 5. The "Click Here" Property Links

Every `PropertyCard` and `BlogCard` renders a "Click Here →" link that points to
`/properties/:slug` or `/blog/:slug` — i.e. it always routes to that **specific**
item's detail page, not a generic listing page. Slugs are auto-generated from the
title on creation (see the Mongoose `pre("validate")` hooks in `models/Property.js`
and `models/Blog.js`).

---

## 6. Project Structure

```
realestate-mern/
├── backend/
│   ├── models/        Property, Blog, Admin, Enquiry
│   ├── routes/        auth, properties, blogs, enquiry
│   ├── middleware/     auth.js (JWT guard for admin-only routes)
│   ├── utils/          mailer.js, seedAdmin.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       Home, About, Properties, PropertyDetail, Blog, BlogDetail
        ├── pages/admin/ Login, Dashboard, AddProperty, AddBlog
        ├── components/  Navbar, Footer, PropertyCard, BlogCard, EnquiryForm, ProtectedRoute
        ├── context/     AuthContext (admin session)
        └── api/         axios.js
```

## 7. Deploying
- Backend: Render, Railway, or a small VPS + PM2. Point `MONGO_URI` at Atlas.
- Frontend: Vercel or Netlify (`npm run build` → deploy `dist/`), with
  `VITE_API_URL` set to your deployed backend URL.
- Update `CLIENT_URL` in the backend `.env` to your deployed frontend origin (CORS).

## 8. Sample data
No seed data is included beyond the admin account — log in and add your first
few properties and posts through the Admin Panel so the imagery and copy are your
own from day one.
