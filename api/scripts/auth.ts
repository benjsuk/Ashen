import { auth } from "./firebase";

class AuthUtil {
  async authenticate(req: any) {
    const header = req.headers.get("Authorization");
    const token = header?.startsWith("Bearer ")
      ? header.slice("Bearer ".length)
      : null;
    if (!token) return null;

    try {
      return await auth.verifyIdToken(token);
    } catch {
      return null;
    }
  }
}

export const authUtil = new AuthUtil();
