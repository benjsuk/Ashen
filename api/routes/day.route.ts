import { config } from "../config";
import { NIL } from "uuid";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";
import { authUtil } from "../scripts/auth";

class Day {
  async GET(req: any) {
    const headers = req.headers;
    const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
    const decoded = await authUtil.authenticate(req);
    if (!decoded) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const uid = decoded.uid;
    const result = await getDay(new Date(req.params.day), Ashenuuid);
    return Response.json(result, {
      headers: config.defaultHeaders,
    });
  }
  async POST(req: any) {
    try {
      const headers = req.headers;
      const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
      const decoded = await authUtil.authenticate(req);
      if (!decoded) {
        return new Response(null, {
          status: 401,
          headers: config.defaultHeaders,
        });
      }
      const uid = decoded.uid;
      const day = new Date(req.params.day);
      if (!Number.isInteger(req.body.balance)) {
        throw "Validation";
      }

      try {
        await setDay(day, Ashenuuid, req.body.balance);
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
