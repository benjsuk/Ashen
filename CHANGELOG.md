## [0.1.0] - 2026-09-22

> [!NOTE]
> Changelog refers to last released version, not last commit. Check tags.

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
