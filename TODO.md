# TODO

Ashen development roadmap, chronological. Work top-to-bottom.

## How to use this file

- Exactly **one** task in progress at a time, the first unticked task below your current position is the next thing.
- Tick `[x]` when done; keep `[ ]` for everything not started. This file is meant to be edited freely.
- Milestone complete = every task ticked -> update `CHANGELOG.md`, bump `package.json` version, git-tag `vX.Y.Z`, then move to the next milestone.
- Near-term milestones are concrete; far-future items are deliberately vague, break them down when they get close.

## Ground rules (never violated)

- All money is integer **pence**. All money is either income or expense.
- Dates are day-granularity (`DATE`).
- Every query is scoped by `userID`, user data stays segmented, always.

---

## M0 - Skeleton -> `v0.0.1-proto`

- [x] Thin `index.ts` entrypoint (Bun HTTP server)
- [x] `/status` route
- [x] Graceful shutdown on SIGINT/SIGTERM
- [x] Docker compose DB start/stop in `db.ts`
- [x] `CHANGELOG.md` started

## M1 - Database schema -> `v0.1.0-alpha`

- [x] `docs/database_schema.md`, Users, Days, Transactions
- [x] `db_server/init.sql`, FKs + composite `(date, userID)` key on days
- [x] Seed dev user
- [x] Tag `v0.1.0-alpha`

## M2 - Access functions & transactions round-trip -> `v0.1.0`

The app can read and write real transaction data.

- [x] Parameterized queries in `db.ts` (replace `mysql.unsafe()` string SQL)
- [x] Implement `logTransaction`, INSERT into `transactions`
- [x] Implement `getTransactions`, SELECT scoped by `userID`
- [x] Routes: `POST /transactions`, `GET /transactions`
- [x] Request validation + proper 4xx/5xx responses
- [x] Tick README: `Database -> Schema`, `Database -> Access Functions`
- [x] Release: changelog + tag `v0.1.0`

## M3 - Day & month totals -> `v0.2.0`

Answer "how much did I spend when?", per user, by day, month, or transaction.

- [x] Compute per-day totals from `transactions` (group by date)
- [x] `GET /today`, specifically today's total
- [x] Split routes into files
- [x] `POST /day/:day`, adding balances to the days
- [x] `GET /days/:from/:to`, per-day totals for a user
- [x] Re-arrange files to be a bit more clean.
- [x] Release: changelog + tag `v0.2.0`

## M4 - Authentication (Firebase) - > `0.3.0-proactive`

Every request identified; all data segmented by real users.

- [x] Make all times UK time for consistency
- [ ] Set up Firebase project + initialize `firebase-admin`
- [ ] Migrate schema: `userID` -> `varchar(128)` (Firebase UID); drop dev-user seed
- [ ] Auth middleware, verify bearer ID token -> `uid`
- [ ] Auto-provision `users` row on first login
- [ ] Scope all routes by authenticated user
- [ ] Local dev via Firebase Auth Emulator

## M5 - Budget

- [ ] Budget schema (per-user, per-category, per-month limits)
- [ ] Set/get budget routes
- [ ] `GET /months`, monthly aggregation
- [ ] Actual vs budget comparison endpoint

## M6 - Balance graph data

- [ ] Balance-over-time endpoint (derived from `days`)
- [ ] Category breakdown endpoint

## M7 - Diff

- [ ] Compare two periods (e.g. this month vs last month)

## M8 - Rota

- [ ] Schedule/rota planning (schema + API)

## M9 - Projections

- [ ] Future cashflow projection from recurring patterns

## Far future, platforms (split these out when you get there)

- [ ] Web client
- [ ] Windows client
- [ ] iOS client (`Ashen-iOS` submodule)
