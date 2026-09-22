import { utils } from "./utils";
import { config } from "./config";
import { callDB, startDB, stopDB } from "./db";
import {
  getTransactions,
  logTransaction,
  newTransaction,
  getTransaction,
  type Transaction,
} from "./transactions";
import { NIL } from "uuid";

const util = new utils();
util.log("Loading...");
const PORT = Number(config.port ?? 4326);
var startTime = new Date().getTime();

try {
  util.debug("Starting DB Server...");
  await startDB();
} catch (e) {
  util.error(e);
  process.exit(1);
}

var endTime = new Date().getTime();

util.debug(
  "DB Server Started. (" + ((endTime - startTime) / 1000).toString() + "s)",
);
util.debug("Starting Bun Server...");
startTime = new Date().getTime();

const server = Bun.serve({
  port: PORT,
  routes: {
    "/status": async () => {
      util.debug("Recieved /status GET");
      return new Response("OK");
    },
    "/list-tables": async () => {
      util.debug("Received /list-tables GET; Calling DB");
      const dbResult = await callDB("show tables", null, true);
      util.debug(
        "DB Returned: " +
          JSON.stringify(dbResult[0]) +
          "(" +
          dbResult[1] +
          "ms)",
      );
      return new Response(JSON.stringify(dbResult[0]));
    },
    /*"/test-transaction": async () => {
 util.debug("Received /test-transaction GET; Calling DB");
 util.debug("Getting Transactions...")
 const dbResult = (await getTransaction("01a0c674-397c-73d1-ae27-1f855a112f93") || "NONE")
 return Response.json(JSON.parse(JSON.stringify(dbResult[0])));
 },*/
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
});
endTime = new Date().getTime();
util.debug("Bun Server Started. (" + (endTime - startTime).toString() + "ms)");
util.log(`API online at ${server.url}`);

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("");
  util.log(`Received ${signal}, Stopping...`);
  util.debug("Stopping Bun Server...");
  startTime = new Date().getTime();
  server.stop(false);
  endTime = new Date().getTime();
  util.debug(
    "Bun Server Stopped. (" + (endTime - startTime).toString() + "ms)",
  );

  try {
    startTime = new Date().getTime();
    util.debug("Stopping DB Server...");
    await stopDB();
    endTime = new Date().getTime();
    util.debug(
      "DB Server Stopped. (" + ((endTime - startTime) / 1000).toString() + "s)",
    );
    util.log("Successfully Stopped. Bye!");
  } catch (e) {
    util.error(e);
    util.error("DB Server May Not Have Closed!");
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
