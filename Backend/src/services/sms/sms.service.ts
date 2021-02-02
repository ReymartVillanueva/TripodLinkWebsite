require("worker_threads");
import { workerData, parentPort } from "worker_threads";
import {
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
  IInterfaceWorkerMessage,
} from "../../interfaces/itf-socket-message.interface";

const companyId: string = workerData["companyId"];
const serviceId: string = workerData["serviceId"];
const interfaceId: string = workerData["interfaceId"];
const interfaceName: string = workerData["interfaceName"];

console.log({ workerData: workerData });

postMessage(
  InterfaceSocketMessageType.Information,
  InterfaceSocketMessageTarget.WindowAndBadge,
  `Initializing service...`
);

console.log(`Initializing service...`);

let i = 1;
export const main = async () => {
  await setTimeout(() => {
    console.log(`${interfaceName} => ${i}`);
    addOutCount();
    postMessage(
      InterfaceSocketMessageType.Information,
      InterfaceSocketMessageTarget.WindowAndBadge,
      `${interfaceName} => ${i}`
    );

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
