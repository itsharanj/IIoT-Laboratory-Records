<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2c03faf8-ef7d-4c7f-9938-0fc566e85a4e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Student register-number login and progress

Run the latest SQL migration in Supabase SQL Editor: `supabase/migrations/20260927_experiment_overrides.sql`. It creates `public.student_progress`.

Students enter only their college register number. Existing numbers load their saved completion list; new numbers are created automatically. Completion changes are saved to Supabase and also cached locally as a fallback.

The My Progress screen is grouped into: Normal I/O Experiments, ThingSpeak, Cisco Packet Tracer, Blynk, Web Server, and Arduino IoT Cloud.

## 2026-09-27 student/admin upgrades
- My Progress is responsive: mobile uses a single-column flow; desktop expands into a multi-column experiment grid.
- Progress supports Not Started / In Progress / Completed and persists `experiment_status` in Supabase.
- Admin has Students, Analytics, Activity and Settings workspaces, plus CSV progress export and protected reset/delete actions.
- Student login/progress activity is recorded in `student_activity`.
- `lab_settings` supports laboratory identity and a student-facing announcement.
- Run the new migration `supabase/migrations/20260927_student_admin_upgrades.sql` once in Supabase SQL Editor.


## Student page runtime fix
- `src/App.tsx` now imports the Supabase client used by the optional lab-settings announcement query, preventing the `supabase is not defined` runtime crash after student login.
- The migration `supabase/migrations/20260927_student_admin_upgrades.sql` must still be executed once in the Supabase SQL Editor to create `experiment_status`, `student_activity`, and `lab_settings`.

## Student roster greeting

The student portal now maps the supplied class register numbers to student names for the header greeting. Register `175EC24017` (CHANDANA NAIKAR R) is specially marked with a `SUPPORTER` badge. Unknown register numbers continue to use the existing auto-create flow and show a generic `Student` greeting.

## 2026-10-01 UI + Security update
- Product theme is now black + sky blue with restrained cyan glow.
- Added a student profile popover with register number and live progress.
- Added a large 3.2-second welcome-back transition after student portal mount.
- Preserved the existing experiment carousel, record/PDF actions, media system, and semantic completion colors.
- Security headers and admin/RLS hardening remain documented in `SECURITY.md` and `SECURITY_AUDIT.md`.
- The current student portal is still register-number based; this is explicitly documented as the main remaining authentication limitation.

## Student login validation

Student register-number login now accepts the established diploma format used by the current roster: `3 digits + 2 uppercase letters + 5 digits` (example: `175EC24046`). Spaces, hyphens, slashes, dots and other special characters are rejected at the login boundary.

Special student accounts that must use email should be configured explicitly rather than inventing an email address. Add the exact register number and exact email mapping before enabling that exception.
