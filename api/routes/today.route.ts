import { util } from "../scripts/utils";
import { config } from "../config";
import { getTransactionsByDay } from "../scripts/transactions";
import { NIL } from "uuid";

class Today {
  async GET(req: any) {
    const headers = req.headers;
    const authToken = headers.get("authentication")?.split("Bearer ")[1];
    const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
    util.debug(Ashenuuid);
    if (authToken != "LSXRqq") {
      return new Response(null, {
        status: 401,
        statusText: "Access Denied",
        headers: config.defaultHeaders,
      });
    }
    var total = 0;
    const dbResult =
      (await getTransactionsByDay(new Date(), Ashenuuid))[0] || "NONE";
    if (dbResult.length > 0) {
      for (let i = 0; i < dbResult.length; i++) {
        if (dbResult[i].direction == "income") {
          total += dbResult[i].amount;
        } else {
          total -= dbResult[i].amount;
        }
      }
    } else {
      return new Response("No Data Found", {
        status: 204,
        headers: config.defaultHeaders,
      });
    }
    return new Response(`${total}`, {
      headers: config.defaultHeaders,
    });
  }
}

const todayRouter = new Today();

export { todayRouter };
