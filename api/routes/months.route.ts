import { config } from "../config";
import { NIL } from "uuid";
import { getDay, setDay } from "../scripts/days";
import { util } from "../scripts/utils";

class Month {
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
    const mFrom = req.params.from;
    const mTo = req.params.today;
  }
}
