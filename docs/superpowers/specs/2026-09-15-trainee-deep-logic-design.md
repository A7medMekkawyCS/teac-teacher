# Trainee Deep Product Logic — Design

## Decisions (approved)
- Product depth for **متدرّب** (User Type `tr`), not code-only refactor
- Full **course journey + Live** in one pass
- Dedicated trainee screens for courses / progress / certificates / Live
- Shared wallet / pay / tx / checkout plumbing with trainee back-nav
- Teacher course/Live expansion deferred to a later batch

## Architecture
- Source of truth: `CourseEnrollment[]` in App state (+ helpers in `traineeLogic.ts`)
- Catalog filters extended in `coursesCatalog.ts`
- Screens: deepen existing courses hub/detail/learn; add `tr-checkout`, `tr-progress`, `tr-certificate`, `tr-lives`, `tr-live-wait`, `tr-live-end`
- Wallet: deduct `course.price` on successful checkout; insufficient → `add-money` then return

## Course journey
1. Discover: richer `tr-home` + filtered `courses` (country, tag/category, live-only, rating, price band)
2. Decide: richer `course-detail` (curriculum, upcoming lives, mock reviews)
3. Buy: `tr-checkout` → wallet or fail
4. Learn: `course-learn` persists completed lessons on enrollment
5. Outcome: `tr-progress`; `tr-certificate` when progress ≥ 80%

## Live journey
1. `tr-lives`: upcoming / today / past for enrolled courses only
2. Notifs + toast on enroll for next live
3. `tr-live-wait` → join → reuse live room feel → `tr-live-end` rating
4. Missed lives marked without harsh penalties; small progress bump on attend

## Account / nav
- Trainee nav: home · courses · my courses · AI · more
- Account rows: marketplace, my courses, progress, certificates, lives, wallet, tx, plans
- Back targets always return to `tr-*` when `role === "tr"`

## Out of scope
- Real backend / LMS
- Teacher publish/Live depth expansion (batch 2)
