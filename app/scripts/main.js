import 'jquery-contextmenu';

import 'jquery-ui/dist/jquery-ui';

import '../styles/mod.scss';


import './polyfill';
import { startTime } from './util';
import './jquery-extension';
import './program-data';
import './kernel';
import { bot } from './bot';
import { login } from './login';
import './sound';

// Initialize the application

function main() {
  new login();

  //ui.windowInitalPositionValues();
}
window.globalBot = new bot($('body'));
window.globalBot.switchAgent('Clippy');
main();
startTime();