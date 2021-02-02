import { Worker } from "worker_threads";
import * as socketio from "socket.io";
import { Logger } from "winston";
import {
  IInterfaceSocketMessage,
  InterfaceSocketMessageType,
  InterfaceSocketMessageTarget,
  IInterfaceWorkerMessage,
} from "../interfaces/itf-socket-message.interface";

export enum WorkerType {
  NotAssigned,
  Emailer,
  SMS,
}

export interface IOption {
  companyId: string;
  interfaceId: string;
  interfaceName: string;
  path: string;
}

export interface IInterfaceWorker {
  serviceId: string;
  type: WorkerType;
  interfaceId: string;
  interfaceName: string;
  processPath: string;
  companyId: string;
  isRunning: boolean;
  worker: Worker;
  socket: socketio.Server;
  logger: Logger;

  inCount: number;
  outCount: number;
  errorCount: number;

  start(): void;
  stop(): Promise<number>;

  sendMessage(
    type: InterfaceSocketMessageType,
    target: InterfaceSocketMessageTarget,
    message: string
  ): void;

  logMessage(type: InterfaceSocketMessageType, message: string): void;

  createMessage(
    type: InterfaceSocketMessageType,
    target: InterfaceSocketMessageTarget,
    message: string
  ): IInterfaceSocketMessage;
}
