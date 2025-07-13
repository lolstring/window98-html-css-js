import type { User, UserFile } from 'application';
import db from './storage';

export class Kernel {

  async store() {
    await db.open();
    await this.reset();
  }
  async reset() {
    await db.msWordCounter.clear();
    await db.processes.clear();
    await db.users.where('current').equals('true').modify({ current: false });
  }

  static async getFileFromLocal(fileID: number): Promise<UserFile | undefined> {
    const userId = (await db.users.filter((user) => user.current).first())?.id;
    const file = await db.files.where({ id: fileID, userId }).first();
    return file;
  }
}