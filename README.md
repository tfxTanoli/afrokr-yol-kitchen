<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Afrodelicious

React 19 + Vite front end, Supabase back end (Auth, Postgres with Row Level Security, Storage).

View the app in AI Studio: https://ai.studio/apps/bf66685b-70da-42e0-aa33-d69bf3f6d9fd

## Run locally
m
**Prerequisites:** Node.js 20+

1. Install dependencies: `npm install --legacy-peer-deps`
   (the AI Studio template pins `esbuild@0.25`, which conflicts with Vite 8's optional peer range; Bun ignores this)
2. Create `.env.local`:
   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   Only the **publishable** key belongs in the front end. Never put the service-role/secret key in a `VITE_` variable.
3. `npm run dev` → http://localhost:3000

## Backend (Supabase)

Schema, policies and storage live in [supabase/migrations/](supabase/migrations/) and are applied in filename order.

| Table | Purpose | Access (RLS) |
|---|---|---|
| `profiles` | One row per auth user (name, email, avatar, country, bio, specialties). Created automatically on sign-up. | Users read/update **their own** row (only `full_name`, `avatar_url`, `country`, `country_flag`, `bio`, `specialties`). Admins read all. |
| `user_roles` | `user` or `admin`, one per user. Always `user` at sign-up. | Users read their own role. **No one can write directly**; changes go through `set_user_role()` (admins only, cannot demote themselves). |
| `recipes` | Recipes (`ingredients` / `instructions` as JSON arrays), `is_published` flag. | Signed-in users read **published** recipes. Admins read all and create/update/delete/publish. |
| Storage `recipe-images` | Recipe photos (JPEG/PNG/WebP, 5 MB max) and preparation-step media under `recipes/steps/` (photos, or MP4/WebM/MOV videos up to 30 s and 25 MB). | Public read; upload/delete by admins only. |
| `recipe_likes`, `recipe_bookmarks` | One row per (recipe, user). Totals come from the `recipe_social_counts()` function. | Users read, add and remove **only their own** rows, on recipes they can see. No one can list who liked what. |
| `recipe_comments` | Comments on recipes. Author name/avatar are copied from the profile by the database. | Signed-in users read comments on published recipes and post as themselves only. Authors delete their own comments; admins delete any (moderation). Comments cannot be edited. |
| `feature_flags` | On/off switch per app module (delivery, restaurants, AI photo scan, masterclasses, stories…). Delivery- and AI-related modules ship **off**. | Signed-in users read them (the UI hides disabled modules). Only admins can change `enabled`, from **Admin Dashboard → Modules**. |

Anonymous visitors have no access to any table; the whole app sits behind sign-in.

Brand assets (official logo, favicons) live in [public/brand/](public/brand/); `afrodelicious-logo-original.jpg` is the file supplied by the client.

### Make someone an administrator

The first administrator must be promoted from the Supabase SQL editor (trusted access):

```sql
update public.user_roles set role = 'admin'
where user_id = (select id from auth.users where email = 'owner@example.com');
```

After that, admins can promote/demote other users from **Dashboard Admin → Users Role**.

### Scripts

- `npm run db:seed`: upserts the original 6 recipes (and uploads their photos) as an admin account.
  Needs `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.
- `npm run test:security`: 56 end-to-end authorization checks (anonymous / member / admin) against the live project.
  Needs `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` (a non-admin account).

## Deployment (Vercel)

Production: https://afrokr-yol-kitchen.vercel.app (Vercel project linked to this repo; every push to `main` deploys).

- Vercel installs with Bun (`bun.lock`) and builds with `vite build`.
- Environment variables (Production + Preview): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_GOOGLE_MAPS_API_KEY`.
  They are baked in at build time, so redeploy after changing them.
- Supabase **Authentication → URL Configuration** is set to:
  - Site URL: `https://afrokr-yol-kitchen.vercel.app`
  - Redirect URLs: `https://afrokr-yol-kitchen.vercel.app/**`, `https://afrokr-yol-kitchen-*.vercel.app/**` (preview deployments),
    `http://localhost:3000/**`, `http://127.0.0.1:3000/**`

  If the app moves to a custom domain, add it to both settings.

### Supabase dashboard settings to review before launch

- **Authentication → SMTP**: configure a custom SMTP provider. Supabase's built-in mailer only delivers to
  project team members and is limited to a few emails per hour, so password-reset emails will not reach real users without it.
- **Authentication → Email**: "Confirm email" is currently **off** (users are signed in right after registering). Turn it on
  once SMTP is configured if you want verified addresses; the app already handles the "check your inbox" case.
