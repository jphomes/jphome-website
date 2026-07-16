# JP Group — Full Deploy Guide (Domain + Atlas + Cloudinary + Hosting)

This guide covers **buying a domain**, connecting DNS, and deploying the app you already have.

**Stack we use**
| Layer | Service |
|-------|---------|
| Domain | Namecheap / Cloudflare / GoDaddy / Hostinger |
| Frontend | [Vercel](https://vercel.com) |
| Backend API | [Render](https://render.com) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Images | [Cloudinary](https://cloudinary.com) |

Repo: one repo is enough (`frontend/` + `backend/`).

---

## A. Buy a domain (you must do this — needs payment)

### Where to buy (pick one)

| Registrar | Why |
|-----------|-----|
| **[Namecheap](https://www.namecheap.com)** | Clear pricing, easy DNS (recommended) |
| **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** | At-cost domains, great DNS |
| **[Hostinger](https://www.hostinger.com)** / **[GoDaddy](https://www.godaddy.com)** | Common in India, UPI often available |
| **[BigRock](https://www.bigrock.in)** | India-focused |

### Name ideas for JP Group
- `jpgroupraipur.com` (best if available)
- `jpgroupraipur.in`
- `jphomesraipur.com`
- `jpplotsraipur.com`

### Buy steps (Namecheap example)
1. Search the name → Add to cart → Checkout.
2. Register with **website.jphomes@gmail.com**.
3. Turn **off** “Domain Privacy email forwarding” only if you need custom mail later (privacy itself is fine).
4. After purchase, open **Domain List → Manage → Advanced DNS**.

You will add records here later (section F). Do **not** point the domain anywhere yet.

---

## B. MongoDB Atlas

1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a **free M0** cluster (Mumbai / Singapore).
3. **Database Access** → user + strong password.
4. **Network Access** → add `0.0.0.0/0` (allow all) for first deploy.
5. **Connect → Drivers** → copy URI:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/jpgroup?retryWrites=true&w=majority
```

Save as `MONGO_URI` (never commit).

---

## C. Cloudinary (images)

1. Sign up at [cloudinary.com](https://cloudinary.com).
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**.
3. No upload preset required — the backend uploads with the API secret.

Admin forms already call:
- `POST /api/upload` (one image)
- `POST /api/upload/many` (multiple)

---

## D. Deploy backend on Render

1. [render.com](https://render.com) → Sign up with GitHub (`jphomes` account).
2. **New → Web Service** → select `jphomes/jphome-website`.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:

```text
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-FRONTEND.vercel.app
ADMIN_USERNAME=jpadmin
ADMIN_EMAIL=website.jphomes@gmail.com
ADMIN_PASSWORD=<strong password>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=jpgroup
```

(Optional SMTP vars from `backend/.env.example` for enquiry emails.)

5. Deploy. Note your URL, e.g. `https://jphome-api.onrender.com`.
6. Test: open `https://jphome-api.onrender.com/api/health` → `{ "status": "ok" }`.

### Seed the only admin (once)

On your PC (with production `MONGO_URI` in `backend/.env`):

```bash
cd backend
npm run seed:admin
```

Or use Render **Shell** if available and run the same command there.

Login path on the site: `/admin/login`.

---

## E. Deploy frontend on Vercel

1. [vercel.com](https://vercel.com) → Import `jphomes/jphome-website`.
2. Settings:
   - **Root Directory:** `frontend`
   - Framework: Vite
3. Environment variables:

```text
VITE_API_URL=https://jphome-api.onrender.com/api
VITE_WHATSAPP_NUMBER=919893911656
VITE_PHONE_NUMBER=9893911656
VITE_PHONE_DISPLAY=+91 98939 11656
VITE_DISTRICT_NAME=Raipur
```

4. Deploy → you get `https://something.vercel.app`.
5. Update Render `CLIENT_URL` to that Vercel URL (or both later):

```text
CLIENT_URL=https://something.vercel.app,https://www.yourdomain.com,https://yourdomain.com
```

6. Redeploy frontend after any `VITE_*` change.

---

## F. Connect your domain (DNS mapping)

Example domain: `jpgroupraipur.com`

### Goal
| Name | Points to |
|------|-----------|
| `jpgroupraipur.com` + `www` | Vercel (website) |
| `api.jpgroupraipur.com` | Render (API) |

### 1) Attach domain on Vercel
1. Vercel project → **Settings → Domains**.
2. Add `jpgroupraipur.com` and `www.jpgroupraipur.com`.
3. Vercel shows exact DNS records (usually):
   - `A` record for `@` → Vercel IP, **or**
   - `CNAME` for `www` → `cname.vercel-dns.com`

Copy exactly what Vercel shows.

### 2) Attach API domain on Render
1. Render service → **Settings → Custom Domains**.
2. Add `api.jpgroupraipur.com`.
3. Render shows a **CNAME** target (e.g. `jphome-api.onrender.com`).

### 3) Add records at your registrar (Namecheap Advanced DNS example)

| Type | Host | Value | TTL |
|------|------|--------|-----|
| A / ALIAS / CNAME | `@` | *(from Vercel)* | Automatic |
| CNAME | `www` | *(from Vercel)* | Automatic |
| CNAME | `api` | `jphome-api.onrender.com` *(or value Render shows)* | Automatic |

Delete old parking-page records if the registrar added any.

### 4) Wait for DNS
- Often 5–30 minutes; can take up to 24–48 hours.
- Check: [https://dnschecker.org](https://dnschecker.org)

### 5) HTTPS
Vercel and Render issue free SSL automatically once DNS is correct.

### 6) Update env for production domains

**Render**
```text
CLIENT_URL=https://jpgroupraipur.com,https://www.jpgroupraipur.com
```

**Vercel** (then Redeploy)
```text
VITE_API_URL=https://api.jpgroupraipur.com/api
```

---

## G. How “IP / name mapping” works (plain English)

You do **not** manually assign a public IP for Vercel/Render.

1. You buy a **name** (`jpgroupraipur.com`).
2. DNS records say: “when someone asks for this name, send them to Vercel/Render.”
3. Those companies map your name to their servers and give you **HTTPS**.

```text
User types jpgroupraipur.com
        │
        ▼
   DNS lookup (registrar)
        │
        ├─ www / @  ──► Vercel  ──► React site
        └─ api      ──► Render  ──► Express + Atlas + Cloudinary
```

---

## H. Final checklist

- [ ] Domain purchased
- [ ] Atlas cluster + `MONGO_URI`
- [ ] Cloudinary keys set on Render
- [ ] Backend live + `/api/health` OK
- [ ] Admin seeded + `/admin/login` works
- [ ] Frontend live + properties load
- [ ] Image upload works in Add Property / Add Blog
- [ ] Custom domain on Vercel + `api.` on Render
- [ ] `CLIENT_URL` + `VITE_API_URL` updated and redeployed
- [ ] WhatsApp / phone env numbers correct

---

## I. What only you can do vs what is already in the code

| Task | Who |
|------|-----|
| Pay for domain | **You** |
| Create Atlas / Cloudinary / Render / Vercel accounts | **You** |
| Paste env vars + click Deploy | **You** |
| Add DNS records at registrar | **You** |
| Cloudinary upload API | **Done in repo** (`/api/upload`) |
| Admin image upload UI | **Done in repo** |
| CORS multi-origin | **Done in repo** |
| `render.yaml` / `vercel.json` | **Done in repo** |

---

## J. After you buy the domain

Tell me the exact domain you bought (e.g. `jpgroupraipur.com`). I will give you the **exact DNS table** and env values filled in for that name, and help push any remaining code to GitHub.
