export type ApplicationConstruct = { windowID: string; description: string }; 

export abstract class Application {
  processID: number;
  windowID = '';
  description = '';

  constructor(processID: number) {
    this.processID = processID;
  }

  getApplicationConstruct(): ApplicationConstruct {
    return {
      windowID: this.windowID,
      description: this.description
    };
  }

  abstract create(): Promise<ApplicationConstruct> | ApplicationConstruct;

}