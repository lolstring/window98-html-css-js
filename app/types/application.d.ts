export type ApplicationConstruct = { windowID: string; description: string };

export type UserFile = {
  id?: number;
  id: string;
  userId?: number;
  filename: string;
  content: string;
  program: string;
  type: string;
  extension: string;
  creationDate: number;
  modifiedDate: number;
  static: boolean;
}

export type User = {
  id: number;
  username: string;
  creationDate: number;
  lastLogin: number;
  displayName: string;
  email: string;
  current: boolean;
}

export type UserPreferences = {
  id?: number;
  userId: number;
  key: string;
  value: string;
}

export type Process = { 
  id?: number;
  program: string; 
  windowID: string; 
  description: string; 
  active: boolean 
}

export type Storage = {
  users: User[];
}

export type LaunchableApplications = MsWord | Notepad | MailClient | Wolf3d | Minesweeper | Winamp | Explorer;