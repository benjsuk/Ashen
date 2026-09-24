import { util } from "../scripts/utils";
import { config } from "../config";
import { getTransactionsByDay } from "../scripts/transactions";
import { NIL } from "uuid";
import { getDay } from "../scripts/days";

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
    const body = req.body;
    const result = getDay(new Date(body.date), Ashenuuid)
    return Response.json(result, {
      headers: config.defaultHeaders,
    });
  }
  async OPTIONS() {
    return new Response(null, { headers: config.defaultHeaders });
  }
  async POST() {}
}

const dayRouter = new Day();

export { dayRouter };
