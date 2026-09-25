## [0.2.0] - 2026-09-25

> [!NOTE]
> Changelog refers to last released version, not last commit. Check tags.

### Added
- Added Lightweight Client.
- Added CORS headers and OPTIONS.
- Added Versioning system at `VERSIONING.md`.
- Created proactive Ashen-Web sub-module.
- Added `/today` endpoint which will calculate total amount for the day.
- Added `/day` endpoint to get / write one day
- Added `/days` to batch get info for a collection of days

### Changed
- Transactions now have a `direction` attribute, which will either be `income` or `expense`, this means not having to deal with negative numbers in either direction.
- Major refactor - Routes are now separate files which can be changed independantly.

## [0.1.0] - 2026-09-22

### Added

- Installed `firebase-admin` package for future use.
- Added `getTransactions` to get all transactions (option to search by user).
- Added functionality to `logTransaction` and `getTransaction`.
- Added `resetDB` for future use.
- Added `/transactions` endpoint which when GET returns all transactions, when POST logs a transaction. Currently using test creds.

### Changed

- Moved API port from `.env` to `config.ts`.
- `callDB` now has options for parameters (to prevent SQL injection) and values (to have values returned).

### Fixed
