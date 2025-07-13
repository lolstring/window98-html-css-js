import type { Process, User, UserFile, UserPreferences } from 'application';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie("Win98") as Dexie & {
  users: EntityTable<User, 'id'>;
  userPreferences: EntityTable<UserPreferences, 'id'>;
  files: EntityTable<UserFile, 'id'>;
  processes: EntityTable<Process, 'id'>;
  msWordCounter: EntityTable<{ id?: number }, 'id'>;
};

db.version(1).stores({
  // users: "++id, username, creationDate, lastLogin, displayName, email, current",
  // userPreferences: "++id, userId, key, value",
  // files: "++id, userId, filename, content, program, type, extension, creationDate, modifiedDate",
  // processes: "++id, processID, program, windowID, description, active",
  files: '++id, fileId, userId, filename, program, type, extension, creationDate, modifiedDate',
  users: '++id, &username, &email, displayName, creationDate, lastLogin',
  userPreferences: '++id, userId, key, [userId+key]',
  processes: '++id, program, windowID, description',
  msWordCounter: "++id",
});

export default db;
