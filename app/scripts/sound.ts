import { Howl } from 'howler';

export const Sound = {
  toggleSound() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.pref.sound = !($('.audio-button').hasClass('mute'));
    localStorage.setItem('currentUser', JSON.stringify(user));
    if ($('.window[program-name="wolf-3d"]').length !== 0) {
      if (!($('.audio-button').hasClass('mute'))) {
        console.log('Sound Enabled');
        (((document.getElementById("wolf-frame") as HTMLIFrameElement)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ?.contentWindow) as unknown as Window & { Wolf: any }
        ).Wolf.Sound.toggle("enable");
      } else {
        console.log('Sound Disabled');
        (((document.getElementById('wolf-frame') as HTMLIFrameElement)
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ?.contentWindow) as unknown as Window & { Wolf: any }
        ).Wolf.Sound.toggle();
      }
    }
    // if($('.window[program-name="wolf-3d"]').length != 0) {
    // 			document.getElementById('wolf-frame').contentWindow.Wolf.Sound.toggle();
    // }
  },
  play(key) {
    if (JSON.parse(localStorage.getItem('currentUser')).pref.sound === true) {
      const options = {
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
      }
      // Setup the options to define this sprite display.
      const _spriteMap = options.spriteMap;
      const howl = new Howl({
        src: options.urls,
        sprite: options.sprite
      });
      const sprite = _spriteMap[key];

      // Play the sprite sound and capture the ID.
      howl.play(sprite);
    } else {
      //log('No sound');
    }
  }
}