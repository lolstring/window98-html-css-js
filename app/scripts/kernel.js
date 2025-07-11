export class kernel {
  constructor() {
    this.init();
  }
  init() { }
  store() {
    if (window.localStorage) {
      localStorage.setItem('processes', '');
      //localStorage.setItem('user', '');
      //localStorage.setItem('userData', '');
      localStorage.setItem('recycleBin', '');
      localStorage.setItem('Kernel Log', '');
      //localStorage.removeItem(processID);
      //localStorage.removeItem(docNumber);
      localStorage.setItem('processID', '[]');
      localStorage.setItem('docNumber', '[]');
    } else {
      log('No Storage');
    }
  }
  vfsInit() {
    const a = localStorage.getItem('fileSystem');
    a ? this.vfsSetup() : this.vfsInit(a);
  }
  vfsSetup() {
  }
  static getFileFromLocal(fileID) {
    let contentDocument;
    let localData = [];
    const result = $.grep(JSON.parse(localStorage.getItem('users')).users, (e) => e.username === JSON.parse(localStorage.getItem('currentUser')).username);
    if (result.length === 1) {
      localData = result[0];
    }
    for (let i = 0; i < localData.files.length; i++) {
      if (fileID === localData.files[i].fileID) {
        contentDocument = localData.files[i];
        break;
      }
    }
    return contentDocument;
  }
}