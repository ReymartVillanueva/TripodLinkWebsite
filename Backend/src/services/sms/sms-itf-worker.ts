import {
  IInterfaceWorker,
  WorkerType,
  IOption,
} from "../../interfaces/itf-worker.interface";
import { Worker } from "worker_threads";
import * as uuid from "uuid";
import * as socketio from "socket.io";
import { Logger } from "winston";
import { createLogger } from "../../util/logger/file-logger";
import {
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
  IInterfaceSocketMessage,
  IInterfaceWorkerMessage,
} from "../../interfaces/itf-socket-message.interface";
import { createSocketConnection } from "../../interfaces/itf-socket";

export class SmsInterfaceWorker implements IInterfaceWorker {
  serviceId: string;
  type: WorkerType;
  interfaceId: string;
  interfaceName: string;
  companyId: string;
  processPath: string;
  isRunning: boolean;
  worker: Worker;
  socket: socketio.Server;
  logger: Logger;

  inCount: number;
  outCount: number;
  errorCount: number;

  static createInterfaceWorker(option: IOption): IInterfaceWorker {
    let smsWorker = new SmsInterfaceWorker();
    smsWorker.serviceId = uuid.v4();
    smsWorker.type = WorkerType.SMS;
    smsWorker.companyId = option.companyId;
    smsWorker.interfaceId = option.interfaceId;
    smsWorker.interfaceName = option.interfaceName;
    smsWorker.processPath = option.path;
    smsWorker.isRunning = false;
    smsWorker.logger = createLogger("sms", option.companyId);
    smsWorker.socket = createSocketConnection(
      `/sms/${smsWorker.companyId}/${smsWorker.serviceId}`
    );

    smsWorker.inCount = 0;
    smsWorker.outCount = 0;
    smsWorker.errorCount = 0;

    return smsWorker;
  }

  start(): void {
    this.worker = new Worker(this.processPath, {
      workerData: {
        companyId: this.companyId,
        serviceId: this.serviceId,
        interfaceId: this.interfaceId,
        interfaceName: this.interfaceName,
      },
    });

    this.isRunning = true;

    this.worker.on("message", (message) => {
      if (message == "add-in-count") this.inCount += 1;
      if (message == "add-out-count") this.outCount += 1;
      if (message == "add-error-count") this.errorCount += 1;

      let wmessage = message as IInterfaceWorkerMessage;

      if (wmessage.message) {
        this.logMessage(wmessage.type, wmessage.message);
        this.sendMessage(wmessage.type, wmessage.target, wmessage.message);
      }
    });

    this.worker.on("exit", async (exitCode) => {
      this.isRunning = false;
      this.logger.log("info", `Stopped with exit code: ${exitCode}.`);

      console.log(`Stopped with exit code: ${exitCode}.`);
    });
  }

  async stop(): Promise<number> {
    let exitCode = await this.worker.terminate();
    this.isRunning = false;
    this.worker = null;

    this.inCount = 0;
    this.outCount = 0;
    this.errorCount = 0;

    return exitCode;
  }

  sendMessage(
    type: InterfaceSocketMessageType,
    target: InterfaceSocketMessageTarget,
    message: string
  ): void {
    let imessage = this.createMessage(type, target, message);
    this.socket.send(JSON.stringify(imessage));
  }

  logMessage(type: InterfaceSocketMessageType, message: string): void {
    switch (type) {
      case InterfaceSocketMessageType.Information: {
        this.logger.log("info", message);
        break;
      }
      case InterfaceSocketMessageType.Warning: {
        this.logger.log("warning", message);
        break;
      }
      case InterfaceSocketMessageType.Error: {
        this.logger.log("error", message);
        break;
      }
    }
  }

  createMessage(
    type: InterfaceSocketMessageType,
    target: InterfaceSocketMessageTarget,
    message: string
  ): IInterfaceSocketMessage {
    let imessage: IInterfaceSocketMessage = {
      serviceId: this.serviceId,
      type: type,
      target: target,
      date: new Date(),
      message: message,
      inCount: this.inCount,
      outCount: this.outCount,
      errorCount: this.errorCount,
      isOnline: this.isRunning,
    };

    return imessage;
  }
}
