import { callDB } from "./db";

class UserUtils {
  async ensureUser(userID: string, name: string | null) {
    if (name) {
      await callDB(
        "INSERT INTO users (userID, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)",
        [userID, name],
      );
    } else {
      await callDB(
        "INSERT INTO users (userID, name) VALUES (?, 'User') ON DUPLICATE KEY UPDATE userID = userID",
        [userID],
      );
    }
  }
}

export const userUtils = new UserUtils();
