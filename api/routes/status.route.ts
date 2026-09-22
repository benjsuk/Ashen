import { util } from "../scripts/utils";
import { config } from "../config";
class Status {
  async GET() {
    util.debug("Recieved /status GET");
    return new Response("OK", { headers: config.defaultHeaders });
  }
}

const statusRouter = new Status();

export { statusRouter };
