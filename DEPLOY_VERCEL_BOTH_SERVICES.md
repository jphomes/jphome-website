# Deploy Both Frontend + Backend on Vercel (Services)

Use this when deploying the monorepo as **one Vercel project** (Application Preset = **Services**).

## Files added/updated

- Root `vercel.json` — defines `frontend` (Vite) + `backend` (Express) and routes `/api` → backend
- `backend/server.js` — exports the Express app for Vercel (local `npm start` still works)
- `frontend/vercel.json` — SPA fallback for React Router
- `frontend/.env.example` — notes `VITE_API_URL=/api` for production

## Vercel dashboard steps

1. Import `jphomes/jphome-website`
2. Keep **Application Preset = Services**
3. Root Directory = `./`
4. Add environment variables (Production):

### Backend

```
NODE_ENV=production
APP_ENV=prod
MONGO_URI_PROD=your_atlas_uri
JWT_SECRET=long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://jphomes.in,https://www.jphomes.in
ADMIN_USERNAME=your_admin_email
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=strong_password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=jpgroup
```

### Frontend

```
VITE_API_URL=/api
VITE_WHATSAPP_NUMBER=...
VITE_PHONE_NUMBER=...
VITE_PHONE_DISPLAY=...
VITE_DISTRICT_NAME=Raipur
```

5. Click **Deploy**
6. Test:
   - `https://YOUR-PROJECT.vercel.app/`
   - `https://YOUR-PROJECT.vercel.app/api/health`
7. Seed admin locally against prod DB: `cd backend && npm run seed:admin`
8. Hostinger DNS: point `jphomes.in` + `www` to Vercel (no separate `api.` subdomain needed)

## Important

Push these repo changes to GitHub **before** deploying, so Vercel picks up the root `vercel.json`.
