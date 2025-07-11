import { isFirstLogin } from "./util";
import { sound } from './sound';
import { kernel } from './kernel';
import { SystemUI } from './system-ui';

export class login {
  constructor() {
    //this.greetings();
    this.eventListeners();
    this.sound = new sound();
    this.login();
    //this.lols();
  }
  greetings() {
    /**
     * Sound
     */
    window.globalBot.speak('Hi, welcome to a recreation of Windows 98 on the web. I am Clippy and I am going to help you around this site.')
    if (isFirstLogin()) {
      window.globalBot.agent((a) => {
        a.speak('This website allows you to relive Windows 98 in a browser. You can login using your own username after logging out.')
        setTimeout(() => {
          a.moveTo(250, 250);
          a.gestureAt(50, 250);
          a.speak('Start here');
        }, 10000)
      });
    }
    // setTimeout(function() {
    //     window.globalBot.speak('To login, type in ANY username and click OK. Sound is muted, to unmute it please click the sound icon at anytime');
    // }, 9000);


  }
  eventListeners() {
    $('#login').off().on('click', '.close,.cancel', () => {
      this.login();
    })
    $('#login').off().on('click', '.ok-button', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.login();
    })
    $('.audio-button').off().on('click', () => {
      $('.audio-button').toggleClass('mute');
      sound.toggleSound();
    })
    $(window).on('load', () => {
      this.greetings();
    });
  }
  /**
   * {
    "users": [
      {
        "username": "",
        "creationDate": {},
        "lastLogin": {},
        "files": [
          {
           "fileID": "",
          "filename": "",
          "content": "",
          "type": "",
          "creationDate": "",
          "modifiedDate": ""
          }
        ],
        "displayname": {},
        "pref": [{
          "sound": ""
          "background": ""
          }],
        "email": ""
      },
      {
        "username": "",
        "creationDate": {},
        "lastLogin": {},
        "files": [
          {
            "filename": "",
            "content": "",
            "type": ""
          },
          {
            "filename": "",
            "content": "",
            "type": ""
          }
        ],
        "displayname": {},
        "pref": "",
        "email": ""
      }
    ]
  }
   */
  login() {
    const username = $('#username').val() || 'Rahul';
    if (window.localStorage) {
      const users = localStorage.getItem('users');
      if (users !== null) {
        if (this.userExists(username)) {
          this.setExistingUser(username);
        } else {
          this.addNewUser(username);
        }
      } else {
        this.firstVisit();
        this.addNewUser(username);
      }
      this.setup();
    } else {
      console.log('No Storage');
      $('#login').css('display', 'none');
      $('#desktop').css('display', 'block');
      sound.play('sprite8');
    }
  }
  userExists(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    let a = false;
    $.each(users.users, function () {
      if (this.username === username) {
        a = true;
        return false
      }
    })
    return a;
  }
  addNewUser(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    const userObj = {
      "username": username,
      "creationDate": Date.now(),
      "lastLogin": Date.now(),
      "files": [],
      "displayname": username,
      "pref": {
        "sound": !($('.audio-button').hasClass('mute')),
        "background": ""
      },
      "email": ""
    };
    userObj.files.push({
      'fileID': 'file-0000000000002',
      'filename': 'License and Credits',
      'content': `
<h3> License </h3><br>
<br>
The Windows 98 name, interface, and sample audio files are a property of
Microsoft Corporation, the code within this project is released under the [MIT
License].<br>
<br>
The MIT License (MIT)<br>
<br>
Copyright (c) [2016-2017] [Rahul Mehra]<br>
<br>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br>
<br>
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br>
<br>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.<br>
<br>
<h3>Credits :</h3> <br>

Wolf3d - https://github.com/jseidelin/wolf3d<br>
Clippy - https://github.com/smore-inc/clippy.js<br>
Winamp2 - https://github.com/captbaritone/winamp2-js<br>
<br>
Please see their respective licenses.
`,
      'type': 'doc',
      'program': 'msword',
      'creationDate': 1476970200000,
      'modifiedDate': 1476970200000
    })
    users.users.push(userObj)
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(userObj));
  }
  setExistingUser(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    let currentUser;
    $.each(users.users, function (k, v) {
      if (this.username === username) {

        this.lastLogin = Date.now();
        this.pref.sound = !($('.audio-button').hasClass('mute'));
        currentUser = v;
        return false;
      }
    });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  firstVisit() {
    const userObj = {
      "users": []
    };
    localStorage.setItem('users', JSON.stringify(userObj));
    return true;
  }
  setup() {
    //log('called1');
    const k = new kernel();
    k.store();

    const ui = new SystemUI();
    ui.init();
    ui.eventListeners();
    ui.setDesktop();
    $('#login').css('display', 'none');
    $('#desktop').css('display', 'block');
    if (!($('.audio-button').hasClass('mute'))) {
      $('#clock > .volume').attr('src', 'images/win98_icons/volume.ico');
    } else {
      $('#clock > .volume').attr('src', 'images/win98_icons/volumemute.ico');
    }
    sound.play('sprite8');
  }
  loaded() {
    $(window).on('load', () => true);
  }
}