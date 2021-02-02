// import method from @types in node_modules
import * as express from "express";
import * as cors from "cors";
import * as bodyparser from "body-parser";

// import method from ts files
import { EmailerRoute } from "./routes/emailer.route";
import { SMSRoute } from "./routes/sms.route";

const app = express();
app.use(cors());
app.use(bodyparser.json());

// services route
app.use("/emailer", EmailerRoute);
app.use("/sms", SMSRoute);

// handle URL request with no routes
app.use((req, res, next) => {
  console.log({ module: "url", url: req.originalUrl });

  const err = new Error("Not Found");

  next(err);
});

// handle errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
    e: error,
  });
});

export { app };
