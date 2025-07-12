import { completeArr } from './util';
import { removeArr } from './util';

export class Process {
  process = [];
  /** @return {nothing} */
  /**
   * @param  program {string}
   * @param  windowID {string/unique}
   * @param  description {string}
   * @return {processID}
   */
  public newProcess(): number {
    //console.log(typeof processesID);
    const processID = this.processIDStore();
    return processID;
    // else {
    // 	super.Error('addProcess');
    // }
  }
  /**
   * Retrieve LocalStorage Process ID 
   * Increament
   * Store Back.
   *
   * @return {processNumber}
   */
  public processIDStore(): number {
    const num = JSON.parse(localStorage.getItem('processID'));
    const processNumber = completeArr(num);
    localStorage.setItem('processID', JSON.stringify(num));
    return processNumber;

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
  processIDRemove(v) {
    const intV = Number.parseInt(v);
    const num = JSON.parse(localStorage.getItem('processID'));
    removeArr(num, intV);
    localStorage.setItem('processID', JSON.stringify(num));
    return true;
  }

  addProcess(processID, program, windowID, description) {
    this.process.push({
      processID: processID,
      program: program,
      windowID: windowID,
      description: description,
      active: true
    });
  }

  removeProcess(processID) {
    const index = this.process.findIndex((p) => p.processID === processID);
    if (index !== -1) {
      this.process.splice(index, 1);
      this.processIDRemove(processID);
      return true;
    }
  }

  setProcessActive(processID) {
    const index = this.process.findIndex((p) => p.processID === processID);
    if (index !== -1) {
      this.process[index].active = true;
      return true;
    }
  }

  setProcessInActive(processID) {
    const index = this.process.findIndex((p) => p.processID === processID);
    if (index !== -1) {
      this.process[index].active = false;
      return true;
    }
  }
}