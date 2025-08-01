import { Application, type ApplicationConstruct } from './application';

export class Wolf3d extends Application {
  
  create(): ApplicationConstruct {
    const construct = this.append();
    this.windowID = construct.windowID;
    this.description = construct.description;
    return construct;
  }

  append(): ApplicationConstruct {
    const wolfData = ` <div id="wolf" class="wolf window ui-widget-content" program-name="wolf-3d" style="display:block;" pid="${this.processID}">
            <div class="window-border">
                <div class="title-bar  h-count" id="parent">
                    <div class="control-box">
                        <a class="button-3d minimize"><span>&nbsp;</span></a>
                        <a class="button-3d maximize" state="min"><span>&nbsp;</span></a>
                        <a class="button-3d close"><span>&nbsp;</span></a>
                    </div>
                    <span class="title">
                   Wolf 3d
                  </span>
                </div>
            <div class="wolf-content">
                <iframe id="wolf-frame" src="installed-programs/wolf3d/index.html" width="640" height="480"></iframe>
            </div>
            </div>
        </div>`;
    $(wolfData).appendTo('#desktop').show('fast').draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    this.windowID = '#wolf';
    this.description = 'Wolf 3D';
    return {
      windowID: this.windowID,
      description: this.description
    };
  }
}