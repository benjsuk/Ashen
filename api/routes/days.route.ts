import { config } from "../config";
import { getDays } from "../scripts/days";
import { authUtil } from "../scripts/auth";

class Days {
  async GET(req: any) {
    const uid = await authUtil.requireUser(req);
    if (!uid) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    var from = new Date(req.params.from);
    var to = new Date(req.params.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
      return new Response(null, {
        status: 400,
        headers: config.defaultHeaders,
      });

    const dayData = await getDays(from, to, uid);
    return Response.json(dayData, { headers: config.defaultHeaders });
  }
}

export const daysRouter = new Days();
