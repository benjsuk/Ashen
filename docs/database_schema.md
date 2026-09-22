# Database Schema

Schema as of v0.2.0-proactive

## Tables

- Users
- Days
- Transactions

### Users

```sql
CREATE TABLE users(
    userID varchar(36) PRIMARY KEY,
    name varchar(255) NOT NULL
);
```

### Days

```sql
CREATE TABLE days(
    date DATE NOT NULL,
    userID varchar(36) NOT NULL,
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
    userID varchar(36) NOT NULL,
    direction ENUM('income', 'expense') NOT NULL DEFAULT 'expense',
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    INDEX idx_transactions_date (date)
);
```
