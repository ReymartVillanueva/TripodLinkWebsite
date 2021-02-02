require("worker_threads");
import { workerData, parentPort } from "worker_threads";

import { SendEmail } from "./result-emailer.util";
import {
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
  IInterfaceWorkerMessage,
} from "../../interfaces/itf-socket-message.interface";

const companyId = workerData["companyId"];
const serviceId = workerData["serviceId"];
const interfaceId = workerData["interfaceId"];
const interfaceName = workerData["interfaceName"];

// console.log({ workerData: workerData });
   ///
postMessage(
  InterfaceSocketMessageType.Information,
  InterfaceSocketMessageTarget.WindowAndBadge,
  `Initializing service...`
);

console.log(`Initializing service...`);

let i = 1;
export const main = async () => {
  // console.log(`set timeout...`);

  await setTimeout(async () => {
    postMessage(
      InterfaceSocketMessageType.Information,
      InterfaceSocketMessageTarget.WindowAndBadge,
      `${interfaceName} => ${i}`
    );

    try {
      await SendEmail(companyId);
      console.log(`${interfaceName} => ${i}`);
      addOutCount();
    } catch (error) {
      addErrorCount();
      postMessage(
        InterfaceSocketMessageType.Error,
        InterfaceSocketMessageTarget.WindowAndBadge,
        `Error => ${error.message}`
      );
    }

    i++;

    main();
  }, 5000);
};

main();

function postMessage(
  type: InterfaceSocketMessageType,
  target: InterfaceSocketMessageTarget,
  message: string
): void {
  const wm: IInterfaceWorkerMessage = {
    type: type,
    target: target,
    message: message,
  };

  parentPort.postMessage(wm);
}

function addInCount() {
  parentPort.postMessage("add-in-count");
}

function addOutCount() {
  parentPort.postMessage("add-out-count");
}

function addErrorCount() {
  parentPort.postMessage("add-error-count");
}
