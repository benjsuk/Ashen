import { config } from "../config";
import { authUtil } from "../scripts/auth";

class Month {
  async GET(req: any) {
    const uid = await authUtil.requireUser(req);
    if (!uid) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const mFrom = req.params.from;
    const mTo = req.params.today;
  }
}
