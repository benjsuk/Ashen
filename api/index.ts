import { utils } from "./utils";
import { config } from "./config";
import { callDB, startDB, stopDB } from "./db";
import {
  getTransactions,
  logTransaction,
  newTransaction,
  getTransaction,
  getTransactionsByDay,
  type Transaction,
} from "./transactions";
import { NIL } from "uuid";

const util = new utils();
util.log("Loading...");
const PORT = Number(config.port ?? 4326);
const defaultHeaders: ResponseInit["headers"] = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authentication, content-type",
};
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
      return new Response("OK", { headers: defaultHeaders });
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
      return new Response(JSON.stringify(dbResult[0]), {
        headers: defaultHeaders,
      });
    },
    "/today": {
      GET: async (req) => {
        const headers = req.headers;
        const authToken = headers.get("authentication")?.split("Bearer ")[1];
        if (authToken != "LSXRqq") {
          return new Response(null, {
            status: 401,
            statusText: "Access Denied",
            headers: defaultHeaders,
          });
        }
        const dbResult = (await getTransactionsByDay(new Date())) || "NONE";
        return Response.json(JSON.parse(JSON.stringify(dbResult[0])), {
          headers: defaultHeaders,
        });
      },
      OPTIONS: async () => {
        return new Response(null, { headers: defaultHeaders });
      },
    },
    "/transactions": {
      GET: async (req) => {
        const headers = req.headers;
        const authToken = headers.get("authentication")?.split("Bearer ")[1];
        if (authToken != "LSXRqq") {
          return new Response(null, {
            status: 401,
            statusText: "Access Denied",
            headers: defaultHeaders,
          });
        }
        const dbResult = (await getTransactions()) || "NONE";
        return Response.json(JSON.parse(JSON.stringify(dbResult[0])), {
          headers: defaultHeaders,
        });
      },
      OPTIONS: async () => {
        return new Response(null, { headers: defaultHeaders });
      },
      POST: async (req) => {
        const headers = req.headers;
        const authToken = headers.get("authentication")?.split("Bearer ")[1];
        if (authToken != "LSXRqq") {
          return new Response(null, {
            status: 401,
            headers: defaultHeaders,
          });
        }
        try {
          let request: any = await req.json();
          request = JSON.parse(JSON.stringify(request));
          if (
            !request.amount ||
            !request.description ||
            !request.date ||
            !((request.amount as number) > 0) ||
            !(
              !request.direction ||
              request.direction == "expense" ||
              request.direction == "income"
            )
          ) {
            return new Response("Transaction not in correct format.", {
              status: 400,
              headers: defaultHeaders,
            });
          }
          const inTransaction = newTransaction(
            request.amount,
            request.description,
            new Date(request.date),
            request.category || null,
            request.user || null,
            request.direction || null,
          );
          await logTransaction(inTransaction);
        } catch (e) {
          return new Response("Error: " + e, {
            status: 500,
            headers: defaultHeaders,
          });
        }
        return new Response("Completed", {
          status: 201,
          headers: defaultHeaders,
        });
      },
    },
  },
  fetch() {
    return new Response("Not Found", { status: 404, headers: defaultHeaders });
  },
});
endTime = new Date().getTime();
util.debug("Bun Server Started. (" + (endTime - startTime).toString() + "ms)");
util.log(`API online at ${server.url}`);
util.log("Press Ctrl+C to terminate.");

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
