export type ApplicationConstruct = { windowID: string; description: string }; 

export abstract class Application {
  processID: number;
  windowID: string;
  description: string;

  constructor(processID: number) {
    this.processID = processID;
  }

  abstract create(): ApplicationConstruct
}