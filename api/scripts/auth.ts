import { auth } from "./firebase";
import { userUtils } from "./users";

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
  async requireUser(req: any): Promise<string | null> {
    const decoded = await authUtil.authenticate(req);
    if (!decoded) return null;
    const uid = decoded.uid;
    await userUtils.ensureUser(uid, decoded.name ?? null);
    return uid;
  }
}

export const authUtil = new AuthUtil();
