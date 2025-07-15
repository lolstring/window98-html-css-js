import type { UserFile } from 'application';
import db from './storage';

export class Kernel {

  async store() {
    await db.open();
    await this.reset();
  }
  async reset() {
    await db.msWordCounter.clear();
    await db.processes.clear();
  }

  static async getFileFromLocal(fileID: number): Promise<UserFile | undefined> {
    const user = await Kernel.getCurrentUser();
    if (!user || !user.id) {
      return;
    }
    const file = await db.files.filter((file) => file.id === fileID && (file.userId === user.id || file.static)).first();
    return file;
  }

  static async getCurrentUser() {
    if (db.isOpen()) {
      const user = await db.users.filter((user) => user.current).first().catch((err) => {
        console.error('Error fetching current user:', err);
        return undefined;
      });
      return user;
    }
  }
}