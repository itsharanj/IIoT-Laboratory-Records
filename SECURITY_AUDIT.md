# IIoT Laboratory Security Audit — 2026-10-01

## Checks performed

- **API keys / secrets:** no service-role key, private key, password, or cloud secret was found in source. `.env.example` contains placeholders only. The educational Exp. 25 code contains a sample SoftAP password (`password123`); it is demonstration code, not a production credential.
- **Admin authentication:** admin access uses Supabase Auth and then checks the authenticated user's `profiles.role === 'admin'` before rendering the admin workspace.
- **Admin data access:** experiment overrides, media management and lab settings are protected by `is_admin()` RLS policies.
- **XSS / form rendering:** user-entered content is rendered through normal React escaping; no `dangerouslySetInnerHTML` usage was found in `src`.
- **Security headers:** Vercel and Netlify header configurations were added.
- **Environment files:** `.env*` remains ignored by Git.
- **Dependencies:** no package dependency was upgraded blindly because the current environment could not complete an online package-lock refresh. The existing manifest was left unchanged to avoid a broken lockfile.
- **Database weakness found:** `student_progress` currently uses register-number-based access with permissive RLS so the existing no-password student workflow continues to work. This is the main remaining security limitation.
- **Activity log:** public reads were removed; only admins can read `student_activity`.

## Recommended next security step

Migrate the student portal to authenticated Supabase users and bind progress to `auth.uid()`. Then remove the public `student_progress` insert/update/select policies. This is the change required for strong student authentication, proper access control, and secure per-student records.
