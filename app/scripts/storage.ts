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
  files: '++id, fileId, userId, filename, program, type, extension, creationDate, modifiedDate',
  users: '++id, &username, &email, displayName, creationDate, lastLogin',
  userPreferences: '++id, userId, key, [userId+key]',
  processes: '++id, program, windowID, description',
  msWordCounter: "++id",
});

db.version(2).stores({
  users: '++id, &username, displayName, creationDate, lastLogin',
})
export default db;
