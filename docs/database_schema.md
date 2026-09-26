# Database Schema

Schema as of v0.3.0-proactive

> `userID` is a Firebase UID (`varchar(128)`), not a UUID. There is no seeded
> dev user — rows in `users` are provisioned automatically on first login.

## Tables

- Users
- Days
- Transactions

### Users

```sql
CREATE TABLE users(
    userID varchar(128) PRIMARY KEY,
    name varchar(255) NOT NULL
);
```

### Days

```sql
CREATE TABLE days(
    date DATE NOT NULL,
    userID varchar(128) NOT NULL,
    balance INT NOT NULL,
    PRIMARY KEY (date, userID),
    CONSTRAINT fk_days_user
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);
```

### Transactions

```sql
CREATE TABLE transactions(
    transactionID varchar(36) PRIMARY KEY,
    amount INT NOT NULL,
    description varchar(255) NOT NULL,
    date DATE NOT NULL,
    category varchar(128),
    userID varchar(128) NOT NULL,
    direction ENUM('income', 'expense') NOT NULL DEFAULT 'expense',
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    INDEX idx_transactions_date (date)
);
```
