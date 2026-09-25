import { config } from "../config";
import { NIL } from "uuid";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";

class Day {
  async GET(req: any) {
    const headers = req.headers;
    const authToken = headers.get("authentication")?.split("Bearer ")[1];
    const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
    if (authToken != "LSXRqq") {
      return new Response(null, {
        status: 401,
        statusText: "Access Denied",
        headers: config.defaultHeaders,
      });
    }
    const result = await getDay(new Date(req.params.day), Ashenuuid);
    return Response.json(result, {
      headers: config.defaultHeaders,
    });
  }
  async POST(req: any) {
    try {
      const headers = req.headers;
      const authToken = headers.get("authentication")?.split("Bearer ")[1];
      const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
      if (authToken != "LSXRqq") {
        return new Response(null, {
          status: 401,
          statusText: "Access Denied",
          headers: config.defaultHeaders,
        });
      }
      const day = new Date(req.params.day);
      try {
        Number(req.body.balance);
      } catch {
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

const dayRouter = new Day();

export { dayRouter };
