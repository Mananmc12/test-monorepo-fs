import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

/**
 * Avoid relying on a broken ComSpec/PATH (fixes "spawn cmd.exe ENOENT" in some terminals).
 * On Windows we invoke %SystemRoot%\System32\cmd.exe explicitly.
 */
function runDev(workspace) {
  if (process.platform === "win32") {
    const systemRoot = process.env.SystemRoot || "C:\\Windows";
    const cmd = path.join(systemRoot, "System32", "cmd.exe");
    return spawn(cmd, ["/d", "/s", "/c", `npm run dev -w ${workspace}`], {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });
  }
  return spawn("npm", ["run", "dev", "-w", workspace], {
    stdio: "inherit",
    cwd: process.cwd(),
    shell: false,
    env: process.env,
  });
}

const children = [runDev("backend"), runDev("frontend")];

function shutdown() {
  for (const c of children) {
    if (c.exitCode === null && c.signalCode === null) {
      c.kill();
    }
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

for (const c of children) {
  c.on("exit", (code, signal) => {
    if (signal) shutdown();
    else if (code !== 0 && code !== null) process.exitCode = code;
  });
}
