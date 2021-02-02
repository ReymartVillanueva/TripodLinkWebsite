//message structure from cloud-cms-dbitfgw to frontend application
export interface IInterfaceSocketMessage {
  type: InterfaceSocketMessageType;
  target: InterfaceSocketMessageTarget;
  date: Date;
  message: string;
  inCount: number;
  outCount: number;
  errorCount: number;
  isOnline: boolean;
  serviceId: string;
}

//message structure from worker to main thread
export interface IInterfaceWorkerMessage {
  type: InterfaceSocketMessageType;
  target: InterfaceSocketMessageTarget;
  message: string;
}

export enum InterfaceSocketMessageType {
  Information,
  Warning,
  Error,
  Blank,
}

export enum InterfaceSocketMessageTarget {
  WindowOnly,
  Badge,
  WindowAndBadge,
}
