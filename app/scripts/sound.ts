import { Howl } from 'howler';
import db from './storage';
import { Kernel } from './kernel';
import { User } from 'application';

interface SpriteMap {
  [key: string]: string;
}

interface SoundInterface {
  options: {
    urls: string[];
    sprite: { [key: string]: [number, number] | [number, number, boolean]; };
    spriteMap: SpriteMap;
  };
  createNewSoundPref(currentUser: User): Promise<void>;
  setInitialState(): Promise<void>;
  toggleSound(desiredState: boolean): void;
  play(key: keyof typeof Sound.options.spriteMap): void;
}

export const Sound: SoundInterface = {
  options: {
    urls: ["../sounds/combinedSound.ogg", "../sounds/combinedSound.m4a", "../sounds/combinedSound.mp3", "../sounds/combinedSound.ac3"],
    sprite: {
      CHIMES: [0, 631.3378684807255],
      CHORD: [2000, 1098.9115646258504],
      DING: [5000, 915.6916099773244],
      LOGOFF: [7000, 3549.0249433106574],
      NOTIFY: [12000, 1352.5170068027207],
      RECYCLE: [15000, 574.6485260770982],
      START: [17000, 45.89569160997797],
      TADA: [19000, 1938.866213151929],
      TMS: [22000, 7858.503401360544]
    },
    spriteMap: {
      sprite0: 'CHIMES',
      sprite1: 'CHORD',
      sprite2: 'DING',
      sprite3: 'LOGOFF',
      sprite4: 'NOTIFY',
      sprite5: 'RECYCLE',
      sprite6: 'START',
      sprite7: 'TADA',
      sprite8: 'TMS'
    }
  },

  async setInitialState() {
    const user = await Kernel.getCurrentUser();
    if (!user) {
      console.error('Current user not found');
      return;
    }
    const userPref = await db.userPreferences.get({ userId: user.id, key: 'sound' });
    let state = false;
    if (!userPref) {
      await this.createNewSoundPref(user);
      state = false;
    }
    if (userPref?.value === 'true') {
      state = true;
    }
    if (state) {
      $('.audio-button').removeClass('mute');
    } else {
      $('.audio-button').addClass('mute');
    }
  },
  async toggleSound(desiredState = true): Promise<void> {
    const user = await Kernel.getCurrentUser();
    if (!user) {
      console.error('currentUser not found');
      return;
    }
    const userPref = await db.userPreferences.get({ userId: user.id, key: 'sound' });
    const userStoredValue = userPref?.value === 'true' || false;
    if (userStoredValue === desiredState) {
      console.log('Sound already in desired state');
    }
    if (desiredState) {
      console.log('Enabling sound');
      await db.userPreferences.put({ userId: user.id, key: 'sound', value: 'true' });
    } else {
      console.log('Disabling sound');
      await db.userPreferences.put({ userId: user.id, key: 'sound', value: 'false' });
    }
    if ($('.window[program-name="wolf-3d"]').length !== 0) {
      console.log('Sound Enabled');
      (((document.getElementById("wolf-frame") as HTMLIFrameElement)
        // biome-ignore lint/suspicious/noExplicitAny: External program
        ?.contentWindow) as unknown as Window & { Wolf: any }
      ).Wolf.Sound.toggle(desiredState ? "enable" : "disable");
    }
    // if($('.window[program-name="wolf-3d"]').length != 0) {
    // 			document.getElementById('wolf-frame').contentWindow.Wolf.Sound.toggle();
    // }
  },
  async play(key: keyof typeof Sound.options.spriteMap) {
    const currentUser = await Kernel.getCurrentUser();
    let playSound = false;
    if (currentUser) {
      const userPref = await db.userPreferences.filter((pref) => pref.userId === currentUser.id && pref.key === 'sound').first();

      if (userPref?.value === 'true') {
        playSound = true;
      }
    }
    if (playSound) {
      const howl = new Howl({
        src: Sound.options.urls,
        sprite: Sound.options.sprite,
      });
      const sprite = Sound.options.spriteMap[key];
      howl.play(sprite);
    }
  },
  async createNewSoundPref(currentUser: User) {
    if (!currentUser.id) {
      throw new Error('Current user ID is not defined');
    }
    const soundPref = {
      userId: currentUser.id,
      key: 'sound',
      value: 'false'
    };
    await db.userPreferences.add(soundPref);
  }
}