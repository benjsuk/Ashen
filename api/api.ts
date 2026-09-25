import { util } from "./scripts/utils";
import { config } from "./config";
import { startDB, stopDB } from "./scripts/db";
import { statusRouter } from "./routes/status.route";
import { dayRouter } from "./routes/day.route";
import { todayRouter } from "./routes/today.route";
import { transactionsRouter } from "./routes/transactions.route";
import { daysRouter } from "./routes/days.route";

util.log("Loading...");
const PORT = Number(config.port ?? 4326);
const defaultHeaders = config.defaultHeaders;
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

async function OPTIONS() {
  return new Response(null, { headers: config.defaultHeaders });
}

const server = Bun.serve({
  port: PORT,
  routes: {
    "/status": async () => {
      return await statusRouter.GET();
    },
    "/day/:day": {
      GET: async (req) => {
        return await dayRouter.GET(req);
      },
      OPTIONS: async () => {
        return await OPTIONS();
      },
      POST: async (req) => {
        return await dayRouter.POST(req);
      },
    },
    "/days/:from/:to": {
      GET: async (req) => {
        return await daysRouter.GET(req);
      },
      OPTIONS: async () => {
        return await OPTIONS();
      },
    },
    "/months/:from/:to": {
      GET: async (req) => {
        return await daysRouter.GET(req);
      },
      OPTIONS: async () => {
        return await OPTIONS();
      },
    },
    "/today": {
      GET: async (req) => {
        return await todayRouter.GET(req);
      },
      OPTIONS: async () => {
        return await OPTIONS();
      },
    },
    "/transactions": {
      GET: async (req) => {
        return await transactionsRouter.GET(req);
      },
      OPTIONS: async () => {
        return await OPTIONS();
      },
      POST: async (req) => {
        return await transactionsRouter.POST(req);
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
