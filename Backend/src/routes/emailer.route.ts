import * as express from "express";
import * as path from "path";

import { getWorkerManager } from "../worker-pool";
import {
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
} from "../interfaces/itf-socket-message.interface";
import { WorkerType } from "../interfaces/itf-worker.interface";
import { EmailerInterfaceWorker } from "../services/emailer/emailer-itf-worker";
import { APP_FOLDER } from "../main";

export const EmailerRoute = express.Router();

//startin emailer service
EmailerRoute.post("/start/:companyId", (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.Emailer);

  if (!iworker) {
    iworker = EmailerInterfaceWorker.createInterfaceWorker({
      companyId: companyId,
      interfaceId: "EMAILER",
      interfaceName: "Result Auto-Emailer",
      path: path.join(APP_FOLDER, "/services/emailer/emailer.service.js"),
    });

    manager.workers.push(iworker);
  }

  if (iworker.isRunning) {
    let imessage = iworker.createMessage(
      InterfaceSocketMessageType.Information,
      InterfaceSocketMessageTarget.WindowAndBadge,
      `${iworker.interfaceName} is already running.`
    );
    res.status(200).send(JSON.stringify(imessage));
  } else {
    //worker thread is not running => start worker
    try {
      iworker.start();

      let imessage = iworker.createMessage(
        InterfaceSocketMessageType.Information,
        InterfaceSocketMessageTarget.WindowAndBadge,
        `Started ${iworker.interfaceName} successfully.`
      );
      res.status(200).send(JSON.stringify(imessage));
    } catch (error) {
      let imessage = iworker.createMessage(
        InterfaceSocketMessageType.Information,
        InterfaceSocketMessageTarget.WindowAndBadge,
        `Error => ${error.message}`
      );
      res.status(400).send(JSON.stringify(imessage));
    }
  }
});

//stopping emailer service
EmailerRoute.post("/stop/:companyId", async (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.Emailer);

  if (!iworker.isRunning) {
    let imessage = iworker.createMessage(
      InterfaceSocketMessageType.Information,
      InterfaceSocketMessageTarget.WindowAndBadge,
      `${iworker.interfaceName} is not running.`
    );

    res.status(200).send(JSON.stringify(imessage));
  } else {
    try {
      let exitCode = await iworker.stop();

      let imessage = iworker.createMessage(
        InterfaceSocketMessageType.Information,
        InterfaceSocketMessageTarget.WindowAndBadge,
        `Stopped successfully with exit code: ${exitCode}.`
      );

      res.status(200).send(JSON.stringify(imessage));
    } catch (error) {
      let imessage = iworker.createMessage(
        InterfaceSocketMessageType.Information,
        InterfaceSocketMessageTarget.WindowAndBadge,
        `Error => ${error.message}`
      );

      res.status(400).send(JSON.stringify(imessage));
    }
  }
});

EmailerRoute.post("/status/:companyId", async (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.Emailer);

  if (!iworker) {
    iworker = EmailerInterfaceWorker.createInterfaceWorker({
      companyId: companyId,
      interfaceId: "EMAILER",
      interfaceName: "Result Auto-Emailer",
      path: path.join(APP_FOLDER, "/services/emailer/emailer.service.js"),
    });

    manager.workers.push(iworker);
  }

  let imessage = iworker.createMessage(
    InterfaceSocketMessageType.Information,
    InterfaceSocketMessageTarget.WindowAndBadge,
    ""
  );

  res.status(200).send(JSON.stringify(imessage));
});
