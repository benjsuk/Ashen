CREATE TABLE users(
    userID varchar(36) PRIMARY KEY,
    name varchar(255) NOT NULL
);
CREATE TABLE days(
    date DATE NOT NULL,
    userID varchar(36) NOT NULL,
    balance INT NOT NULL,
    PRIMARY KEY (date, userID),
    CONSTRAINT fk_days_user
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);
CREATE TABLE transactions(
    transactionID varchar(36) PRIMARY KEY,
    amount INT NOT NULL,
    description varchar(255) NOT NULL,
    date DATE NOT NULL,
    category varchar(128),
    userID varchar(36) NOT NULL,
    CONSTRAINT fk_transactions_user
        FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    INDEX idx_transactions_date (date)
);

INSERT INTO users (userID, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Admin');