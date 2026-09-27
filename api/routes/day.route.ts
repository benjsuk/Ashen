import { config } from "../config";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";
import { authUtil } from "../scripts/auth";

class Day {
  async GET(req: any) {
    const uid = await authUtil.requireUser(req);
    if (!uid) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const result = await getDay(new Date(req.params.day), uid);
    return Response.json(result, {
      headers: config.defaultHeaders,
    });
  }
  async POST(req: any) {
    try {
      const uid = await authUtil.requireUser(req);
      if (!uid) {
        return new Response(null, {
          status: 401,
          headers: config.defaultHeaders,
        });
      }
      const day = new Date(req.params.day);
      if (!Number.isInteger(req.body.balance)) {
        throw "Validation";
      }

      try {
        await setDay(day, uid, req.body.balance);
      } catch {
        return new Response(null, {
          status: 500,
          headers: config.defaultHeaders,
        });
      }
      return new Response("OK", { headers: config.defaultHeaders });
    } catch (e) {
      util.error(e);
      return new Response(null, {
        status: 400,
        headers: config.defaultHeaders,
      });
    }
  }
}

export const dayRouter = new Day();
