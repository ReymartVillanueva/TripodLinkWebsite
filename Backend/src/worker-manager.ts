import {
  WorkerType,
  IInterfaceWorker,
} from "./interfaces/itf-worker.interface";

export class WorkerManager {
  companyId: string;
  workers: IInterfaceWorker[];

  getInterfaceWorker(wtype: WorkerType): IInterfaceWorker {
    return this.workers.find((wm) => wm.type == wtype);
  }
}
