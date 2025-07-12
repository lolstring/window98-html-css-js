import type { User, UserFile } from 'application';

export class Kernel {
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
      console.log('No Storage');
    }
  }
  static getFileFromLocal(fileID) {
    let file: UserFile | undefined;
    let localData: User | undefined;
    const result = $.grep(JSON.parse(localStorage.getItem('users')).users, (e: User) => e.username === JSON.parse(localStorage.getItem('currentUser')).username);
    if (result.length === 1) {
      localData = result[0];
    }
    for (let i = 0; i < localData.files.length; i++) {
      if (fileID === localData.files[i].fileID) {
        file = localData.files[i];
        break;
      }
    }
    return file;
  }
}