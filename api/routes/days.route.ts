import { config } from "../config";
import { NIL } from "uuid";
import { getDays } from "../scripts/days";
import { authUtil } from "../scripts/auth";

class Days {
  async GET(req: any) {
    const headers = req.headers;
    const Ashenuuid = headers.get("Ashenuuid") || NIL.replace("0", "1");
   const decoded = await authUtil.authenticate(req);
if (!decoded) {
  return new Response(null, { status: 401, headers: config.defaultHeaders });
}
const uid = decoded.uid;
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
