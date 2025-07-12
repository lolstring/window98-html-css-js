export type UserFile = {
  fileID: string;
  filename: string;
  content: string;
  program: string;
  type: string;
  creationDate: number;
  modifiedDate: number;
}
export type User = {
    username: string;
    creationDate: number;
    lastLogin: number;
    files: UserFile[];
    displayname: string;
    pref: {
        sound: boolean;
        background: string;
    };
    email: string;
}

export type Storage = {
  users: User[];
}

export type LaunchableApplications = MsWord | Notepad | MailClient | Wolf3d | Minesweeper | Winamp | Explorer;