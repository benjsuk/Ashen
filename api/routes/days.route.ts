import { config } from "../config";
import { NIL } from "uuid";
import { getDays } from "../scripts/days";

class Days {
  async GET(req: Request) {
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
    var from = new Date(req.params.from);
    var to = new Date(req.params.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
      return new Response(null, {
        status: 400,
        headers: config.defaultHeaders,
      });

    const dayData = await getDays(from, to, Ashenuuid);
    return Response.json(dayData, { headers: config.defaultHeaders });
  }
}

export const daysRouter = new Days();
