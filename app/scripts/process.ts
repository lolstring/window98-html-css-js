import { completeArr } from './util';
import { removeArr } from './util';

export class process {
  /** @return {nothing} */
  /**
   * @param  program {string}
   * @param  windowID {string/unique}
   * @param  description {string}
   * @return {processID}
   */
  newProcess() {
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
  processIDStore() {
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
  /**
   * @param {process}
   * @param {program}
   * @param {windowID}
   * @param {description}
   * return true/false if added successfully.
   */
  addProcess(processID, program, windowID, description) {
  }
  removeProcess(processID) {
  }
  setStorage() {
  }
  setProcessActive(processID) {
  }
  setProcessInActive(processID) {
  }
  static remove(processID) {

  }
}