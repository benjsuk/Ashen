import { util } from "../scripts/utils";
import { config } from "../config";
import { getTransactionsByDay } from "../scripts/transactions";
import { NIL } from "uuid";

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
    var result = 0;
    const dbResult =
      (await getTransactionsByDay(new Date(), Ashenuuid))[0] || "NONE";
    if (dbResult.length > 0) {
      for (let i = 0; i < dbResult.length; i++) {
        if (dbResult[i].direction == "income") {
          result += dbResult[i].amount;
        } else {
          result -= dbResult[i].amount;
        }
      }
    } else {
      return new Response("No Data Found", {
        status: 204,
        headers: config.defaultHeaders,
      });
    }
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
