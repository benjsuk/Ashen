import { config } from "../config";
import { getTransactionsByDay } from "../scripts/transactions";
import { authUtil } from "../scripts/auth";

class Today {
  async GET(req: any) {
    const uid = await authUtil.requireUser(req);
    if (!uid) {
      return new Response(null, {
        status: 401,
        headers: config.defaultHeaders,
      });
    }
    var total = 0;
    const dbResult = (await getTransactionsByDay(new Date(), uid))[0] || "NONE";
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
