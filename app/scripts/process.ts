import db from './storage';
import { completeArr } from './util';
import { removeArr } from './util';

interface Process {
  processID: number;
  program: string;
  windowID: string;
  description: string;
  active: boolean;
}

export class ProcessManager {
  process: Process[] = [];
  /** @return {nothing} */
  /**
   * @param  program {string}
   * @param  windowID {string/unique}
   * @param  description {string}
   * @return {processID}
   */
  public async newProcess(): Promise<number> {
    // Create an empty process entry as a new process lock in the database
    const processID = await db.processes.add({
      program: '',
      windowID: '',
      description: '',
      active: false
    });
    return processID as number;
  }
  /**
   * Retrieve LocalStorage process ID
   * REMOVE from arr
   * Store back into Local
   *
   * 
   * @param  {Value to Remove}
   * @return {true/false}
   */
  async processIDRemove(v: number): Promise<boolean> {
    await db.processes.where({ id: v }).delete();
    return true;
  }

  async updateProcess(processID: number, program: string, windowID: string, description: string, active = true) {
    await db.processes.where({ id: processID }).modify({
      program: program,
      windowID: windowID,
      description: description,
      active
    });
    if (active) {
      this.setProcessActive(processID);
    }
  }

  removeProcess(processID: number) {
    return db.processes.where({ id: processID }).delete();
  }

  // Ensure only one process is active at a time
  async setProcessActive(processID: number) {
    await db.processes.filter((obj) => obj.active === true).modify({ active: false });
    await db.processes.where({ id: processID }).modify({ active: true });
  }

  async setProcessInActive(processID: number) {
    await db.processes.where({ id: processID }).modify({ active: false });
    return true;
  }
}