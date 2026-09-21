import { utils } from "./utils";
import { startDB, stopDB } from "./db";

const util = new utils();
const PORT = Number(process.env.PORT ?? 3000);

try {
  util.debug("Starting DB Server...");
  await startDB();
} catch (e) {
  util.error(e);
  process.exit(1);
}

util.log("DB Server Started.");

const server = Bun.serve({
  port: PORT,
  routes: {
    "/status": new Response("OK"),
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
});

util.log(`API online at ${server.url}`);

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("")
  util.debug(`Received ${signal}, shutting down...`);
  server.stop(true);

  try {
    util.debug("Stopping DB Server...");
    await stopDB();
    util.log("DB Server Stopped.");
  } catch (e) {
    util.error(e);
    util.error("DB Server May Not Have Closed!");
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));