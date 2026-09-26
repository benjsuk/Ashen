import { config } from "../config";
import { NIL } from "uuid";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";
import { authUtil } from "../scripts/auth";

class Month {
  async GET(req: any) {
    const headers = req.headers;
   const decoded = await authUtil.authenticate(req);
if (!decoded) {
  return new Response(null, { status: 401, headers: config.defaultHeaders });
}
const uid = decoded.uid;
    const mFrom = req.params.from;
    const mTo = req.params.today;
  }
}
