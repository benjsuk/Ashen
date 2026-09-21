import { config } from "./config";

class utils {
  debug(input: any) {
    if (!config.debugMode) return;
    console.log(
      new Date().toISOString().split("Z")[0]?.replace("T", " "),
      Bun.color("blue", "ansi-256") +
        "[DEBUG]" +
        Bun.color("black", "ansi-256"),
      input,
    );
  }
  log(input: any) {
    if (!config.debugMode) return;
    console.log(
      new Date().toISOString().split("Z")[0]?.replace("T", " "),
      Bun.color("grey", "ansi-256") +
        "[NOTES]" +
        Bun.color("black", "ansi-256"),
      input,
    );
  }
  error(input: any) {
    console.error(
      (Bun.color("red", "ansi-256") || "") +
        new Date().toISOString().split("Z")[0]?.replace("T", " "),
      "[ERROR]" + 
      Bun.color("black", "ansi-256"),
      input,
    );
  }
}

export { utils };
