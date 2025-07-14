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
    const userId = (await db.users.filter((user) => user.current).first())?.id;
    if (!userId) {
      return;
    }
    const file = await db.files.filter((file) => file.id === fileID && (file.userId === userId || file.static)).first();
    return file;
  }
}