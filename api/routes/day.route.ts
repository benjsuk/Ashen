import { config } from "../config";
import { NIL } from "uuid";
import { getDay } from "../scripts/days";
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
      const day = new Date(req.params.day);

      return new Response();
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
