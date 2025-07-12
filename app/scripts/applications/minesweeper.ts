import { Application } from './application';

export class Minesweeper extends Application{
  constructor(processID) {
    super(processID);
    const {windowID, description} = this.create();
    this.windowID = windowID;
    this.description = description;
  }
  create() {
    return this.append();
  }
  append() {
    const minesweeperData = ` <div id="minesweeper" class="window ui-widget-content" style="display:block;" program-name="minesweeper" pid = "${this.processID}">
              <div class="window-border">
              <div class="title-bar  h-count" id="parent">
                <div class="control-box">
                  <a class="button-3d minimize"><span>&nbsp;</span></a>
                  <a class="button-3d maximize"><span>&nbsp;</span></a>
                  <a class="button-3d close"><span>&nbsp;</span></a>
                </div>
                <span class="title">
                  Minesweeper
                </span>
              </div>
              <div class="clear"></div>
              <div id="minesweeper-content">
                <iframe src="installed-programs/mine/minecore.html" id="mine-frame" scrolling="no" ></iframe>
              </div>
              </div>
            </div>`;
    $(minesweeperData).appendTo('#desktop').show('fast').draggable({
      handle: '.title-bar'
    });
    return {
      windowID: '#minesweeper',
      description: 'minesweeper'
    };
  }
}