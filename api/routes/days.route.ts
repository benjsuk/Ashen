import { config } from "../config";
import { NIL } from "uuid";
import type { Day } from "../scripts/days";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";

class Days {
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
    var from = new Date(req.params.from);
    var to = new Date(req.params.to);
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
      return new Response(null, {
        status: 400,
        headers: config.defaultHeaders,
      });

    let dates: Date[] = [];
    const theDate = from;
    while (theDate < to) {
      dates.push(new Date(theDate));
      theDate.setDate(theDate.getDate() + 1);
    }
    const dayData: any[] = [];
    for (let i = 0; i < dates.length; i++) {
      const thisDay: Date = dates[i] ?? new Date(0);
      const thisDayData = await getDay(thisDay, Ashenuuid);
      dayData.push(thisDayData);
    }

    return Response.json(dayData, { headers: config.defaultHeaders });
  }
}

const daysRouter = new Days();

export { daysRouter };
