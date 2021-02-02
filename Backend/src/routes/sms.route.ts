import * as express from "express";
import * as path from "path";

import { getWorkerManager } from "../worker-pool";
import {
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
} from "../interfaces/itf-socket-message.interface";
import { WorkerType } from "../interfaces/itf-worker.interface";
import { SmsInterfaceWorker } from "../services/sms/sms-itf-worker";
import { APP_FOLDER } from "../main";

export const SMSRoute = express.Router();

//starting SMS service
SMSRoute.post("/start/:companyId", (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.SMS);

  if (!iworker) {
    iworker = SmsInterfaceWorker.createInterfaceWorker({
      companyId: companyId,
      interfaceId: "SMS",
      interfaceName: "SMS Result Notification",
      path: path.join(APP_FOLDER, "/services/sms/sms.service.js"),
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
      iworker.isRunning = true;

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

//stopping SMSRoute service
SMSRoute.post("/stop/:companyId", async (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.SMS);

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

SMSRoute.post("/status/:companyId", async (req, res, next) => {
  let companyId = req.params.companyId;
  let manager = getWorkerManager(companyId);
  let iworker = manager.getInterfaceWorker(WorkerType.SMS);

  if (!iworker) {
    iworker = SmsInterfaceWorker.createInterfaceWorker({
      companyId: companyId,
      interfaceId: "SMS",
      interfaceName: "SMS Result Notification",
      path: path.join(APP_FOLDER, "/services/sms/sms.service.js"),
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
