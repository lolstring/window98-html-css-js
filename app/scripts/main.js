import 'jquery-contextmenu';

import 'jquery-ui/dist/jquery-ui';

import '../styles/mod.scss';


import './polyfill';
import { startTime } from './util';
import './jquery-extension';
import './program-data';
import './kernel';
import { Bot } from './bot';
import { Login } from './login';
import './sound';

// Initialize the application

function main() {
  new Login();

  //ui.windowInitalPositionValues();
}
window.globalBot = new Bot($('body'));
window.globalBot.switchAgent('Clippy');
main();
startTime();

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Rejection:', e.printStack);
});