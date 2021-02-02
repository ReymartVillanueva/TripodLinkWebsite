import { WorkerManager } from "./worker-manager";

const workerManagers: WorkerManager[] = [];

export const getWorkerManager = (companyId: string): WorkerManager => {
  let manager = workerManagers.find((wm) => wm.companyId === companyId);

  if (!manager) {
    manager = new WorkerManager();
    manager.companyId = companyId;
    manager.workers = [];

    workerManagers.push(manager);
  }

  return manager;
};
