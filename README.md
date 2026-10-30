<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Afrodelicious

React 19 + Vite front end, Supabase back end (Auth, Postgres with Row Level Security, Storage).

View the app in AI Studio: https://ai.studio/apps/bf66685b-70da-42e0-aa33-d69bf3f6d9fd

## Run locally

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
| Storage `recipe-images` | Recipe photos (JPEG/PNG/WebP, 5 MB max). | Public read; upload/delete by admins only. |

Anonymous visitors have no access to any table; the whole app sits behind sign-in.

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
- `npm run test:security`: 32 end-to-end authorization checks (anonymous / member / admin) against the live project.
  Needs `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` (a non-admin account).

### Supabase dashboard settings to review before launch

- **Authentication → URL Configuration**: set *Site URL* to the production URL and add it to *Redirect URLs*
  (password-reset links redirect there; `http://localhost:3000/**` is currently allowed for development).
- **Authentication → SMTP**: configure a custom SMTP provider. Supabase's built-in mailer only delivers to
  project team members and is limited to a few emails per hour, so password-reset emails will not reach real users without it.
- **Authentication → Email**: "Confirm email" is currently **off** (users are signed in right after registering). Turn it on
  once SMTP is configured if you want verified addresses; the app already handles the "check your inbox" case.
