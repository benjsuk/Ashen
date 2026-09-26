import { util } from "../scripts/utils";
import { config } from "../config";
import { getTransactionsByDay } from "../scripts/transactions";
import { NIL } from "uuid";
import { authUtil } from "../scripts/auth";

class Today {
  async GET(req: any) {
    const headers = req.headers;
    const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
    util.debug(Ashenuuid);
    const decoded = await authUtil.authenticate(req);
    if (!decoded) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    const uid = decoded.uid;
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

export const todayRouter = new Today();
