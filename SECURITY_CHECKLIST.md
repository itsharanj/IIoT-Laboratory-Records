# Security checklist

| Area | Current state |
|---|---|
| API/service-role keys | Service-role secrets are not bundled; use environment variables. |
| Admin routes | Supabase session + admin-role checks are used before admin workspace access. |
| Access control | Admin database actions use `is_admin()` RLS policies. |
| XSS | React escaping is used; no `dangerouslySetInnerHTML` was found in `src`. |
| Security headers | Vercel and Netlify header configurations are included. |
| Environment files | `.env*` is ignored by Git. |
| Database/RLS | Activity log reads were restricted to admins; existing student-progress compatibility policy remains a known limitation. |
| Password hashing | Not applicable to the current register-number-only student flow. Do not store plaintext passwords if authentication is added. |
| Rate limiting | Must be enforced at an authenticated/API or edge layer; client-only throttling is not a security boundary. |
| CORS | No custom public API server is shipped in the student UI; review Supabase/edge policies when adding one. |
| Debug mode | No production debug switch is intentionally enabled by the UI. |
| Dependencies | Do not blindly upgrade the lockfile; run `npm audit` and review advisories before release. |
| Secret scanning | Keep `.env*` ignored and run a Git secret scanner before publishing. |
| Exposed files | Do not commit credentials, private exports, or local `.env` files. |

## Main remaining issue

The student portal currently uses register-number-based access. Strong per-student authorization requires migrating the student identity to Supabase Auth (or another authenticated identity) and binding progress rows to `auth.uid()`.
