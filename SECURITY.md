# Security hardening

Implemented in this build:
- Supabase anon key remains environment-driven (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`); no service-role key is bundled.
- Administrator access is checked against the authenticated Supabase session and the `profiles.role` value before the admin workspace is rendered.
- React form rendering uses normal escaped React output; user-entered text is not injected with `dangerouslySetInnerHTML`.
- Production security headers are configured for Vercel (`vercel.json`) and Netlify (`public/_headers`): clickjacking protection, MIME sniffing protection, referrer policy, permissions policy and DNS-prefetch control.
- `.env*` files remain ignored by Git.

Important limitation:
- The current student portal uses register-number-based access rather than a password/OAuth session. This is not equivalent to strong authentication. The database currently permits the existing student workflow to read/write progress by register number, so a future security upgrade should migrate students to Supabase Auth (or another authenticated identity) and bind progress rows to `auth.uid()`.
- Rate limiting for student actions should be enforced at the authenticated/API layer when student authentication is upgraded; client-side throttling alone is not a security boundary.
- Supabase Storage/database RLS policies must be applied from the project's SQL migrations; the frontend cannot make those policies secure by itself.
