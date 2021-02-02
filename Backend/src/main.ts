import { app } from "./app";
import * as http from "http";
import * as path from "path";

export const APP_FOLDER = __dirname;
export const LOG_FOLDER = path.join(__dirname, "log");
export const LOGGER_CONFIG_FOLDER = path.join(__dirname, "log-config");

const PORT = process.env.PORT || 3000;

export const server = http.createServer(app);

server.listen(PORT);
server.on("listening", () => {
  console.info(`Listening on port ${PORT}`);
});
