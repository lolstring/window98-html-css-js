import { kernel } from './kernel';

export class Notepad {
  constructor(processID, fileID) {
    this.fileID = fileID;
    this.processID = processID;
    const { windowID, description } = this.create();
    this.windowID = windowID;
    this.description = description;
  }
  saveListener() {
    const doc = $(`[pid="${this.processID}"] .document-wrap`);
    const contents = $(doc).html();
    $(doc).blur(function () {
      if (contents !== $(this).html()) {
        $(this).closest('div[pid]').attr('saved', "false");
      }
    });

  }
  create() {
    this.a++;
    //let notepadID = 'notepad-' + processID;
    let file;
    let description;
    let content;
    let filename;
    let type;
    if (this.fileID) {
      //log(this.fileID);
      //var file = this.filename.split('.');
      file = kernel.getFileFromLocal(this.fileID);
      description = `${file.filename} - Notepad`;
      content = file.content;
      filename = file.filename;
      type = file.type;
    } else {
      description = 'Untitled - Notepad';
      content = '<div class="clear"></div>';
      filename = 'Unitled';
      type = '';
    }
    const a = this.append(filename, content, type, description);
    this.saveListener();
    //SystemUI.setWindowPosition(a);
    return a;
  }
  append(filename, content, _type, description) {
    const cd = 'contenteditable="true"';
    const notepadData = `<div id="notepad-${this.processID}" class="notepad window ui-widget-content" pid="${this.processID}" program-name="notepad" fileID=${this.fileID} saved="true">
            <div class="window-border">
                <div class="title-bar  h-count" id="parent">
                    <div class="control-box">
                        <a class="button-3d minimize"><span>&nbsp;</span></a>
                        <a class="button-3d maximize" state="min"><span>&nbsp;</span></a>
                        <a class="button-3d close"><span>&nbsp;</span></a>
                    </div>
                    <span class="title">
                   ${description}
                  </span>
                </div>
                <div class="menu-bar  h-count">
                    <a class="file"><span>F</span>ile</a>
                    <a><span>E</span>dit</a>
                    <a><span>S</span>earch</a>
                    <a><span>H</span>elp</a>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
                <div id="notepad-${this.processID}-content" class="content ui-widget-content">
                    <div class="content-box">
                        <div class="document-scroller">
                            <div class="document-content">
                                <div class="document container">
                                    <div class="document-wrap" ${cd}>
                                        ${content}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        <div id="open" class="ui-widget-content">
          <div class="window-border">
            <div class="title-bar  h-count">
              <div class="control-box">
                <a class="button-3d question-save disabled-action" tabindex="-1"><span>&nbsp;</span></a>
                <a class="button-3d close-save"><span>&nbsp;</span></a>
              </div>
              <span class="title">
                Open
              </span>
            </div>
            <div class="open-content">
              <div class="top-bar">
                <a><span>Look in: </span></a>
                <!--<div class="picker"><span class="arrow"></span><img class="icon" src="images/win98_icons/desktop.ico"/><span>Desktop</span></div>-->
                <select id="save-location" class="picker select" style="margin:3px 4px 3px 12px; width:180px; ">
                <option  disabled selected value="desktop">Desktop</option><!--<option value="both">Download and Save</option>--></select>
                <!--<div class="picker ui-widget">
                  <select id="save-location" class="picker select" style="margin:3px 4px 3px 12px; width:180px; "><option value="desktop">Desktop</option><option value="computer">My Computer(Download)</option><option value="both">Download and Save</option></select></div>-->
                  <div class="action up"></div>
                  <div class="action desktop-ico" style="margin-left:4px"></div>
                  <div class="action new" style="margin-left:4px"></div>
                  <div class="action icon-view" style="margin-left:4px"></div>
                  <div class="action list-view"></div>
                  <div class="clear"></div>
                </div>
                <div class="folders">
                  <div class="content1-box" >
                    <div id="my-computer" class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/computer_explorer.ico" style="width:14px;"/><span style="vertical-align:top">My Computer</span></div>
                    <div id="my-computer" class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/directory_open_file_mydocs.ico" style="width:14px;"/><span style="vertical-align:top">My Documents</span></div>
                    <div id="my-computer" class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/network_normal_two_pcs.ico" style="width:14px;"/><span style="vertical-align:top">Network Neighbourhood</span></div>
                  </div>
                </div>
                <div class="bottom-bar">
                  <p class="text">File Name:</p><input type="text" class="filename" style="position:relative;"><button class="open-button" style="margin-left:12px"><u>O</u>pen</button>
                </div>
                <!--<div class="bottom-bar">
                  <p class="text">Save as type:</p><div class="picker" style="margin:10px 0 10px 10px; width:200px;"><span class="arrow"></span><span>Portable Document File</span></div> <button id="cancel-button""><u>C</u>ancel</button>
                </div>-->
                <div class="bottom-bar">
                  <p class="text">File of type:</p><select id="file-type" class="picker select" style="margin:0px 3px 10px 26px; width:230px; "><option value="pdf">PDF</option><option value="doc" selected>Word</option><option value="txt">Text Document</option></select> <button class="cancel-button"><u>C</u>ancel</button>
                </div>
                  <input type="hidden" class="fileID" value="">
                </div>
            </div>
        </div>
        <div id="save" class="ui-widget-content" style="display:none;">
          <div class="window-border">
            <div class="title-bar  h-count">
              <div class="control-box">
                <a class="button-3d question-save disabled-action"  tabindex="-1"><span>&nbsp;</span></a>
                <a class="button-3d close-save"><span>&nbsp;</span></a>
              </div>
              <span class="title">
                Save
              </span>
            </div>
            <div class="save-content">
              <div class="top-bar">
                <a><span>Save in:</span></a>
                <!--<div class="picker"><span class="arrow"></span><img class="icon" src="images/win98_icons/desktop.ico"/><span>Desktop</span></div>-->
                <select id="save-location" class="picker select" style="margin:3px 4px 3px 12px; width:180px; "><option disabled selected value="none"></option>
                <option value="desktop">Desktop</option><option value="computer">My Computer(Download)</option><!--<option value="both">Download and Save</option>--></select>
                <!--<div class="picker ui-widget">
                  <select id="save-location" class="picker select" style="margin:3px 4px 3px 12px; width:180px; "><option value="desktop">Desktop</option><option value="computer">My Computer(Download)</option><option value="both">Download and Save</option></select></div>-->
                  <div class="action up"></div>
                  <div class="action desktop-ico" style="margin-left:4px"></div>
                  <div class="action new" style="margin-left:4px"></div>
                  <div class="action icon-view" style="margin-left:4px"></div>
                  <div class="action list-view"></div>
                  <div class="clear"></div>
                </div>
                <div class="folders">
                  <div class="content1-box" >
                    <div program-name="explorer" directory="root" class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/computer_explorer.ico" style="width:14px;"/><span style="vertical-align:top">My Computer</span></div>
                    <div program-name="explorer" directory="documents" class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/directory_open_file_mydocs.ico" style="width:14px;"/><span style="vertical-align:top">My Documents</span></div>
                    <div class="folder-list" style="left:0px;"><img class="icon" src="images/win98_icons/network_normal_two_pcs.ico" style="width:14px;"/><span style="vertical-align:top">Network Neighbourhood</span></div>
                  </div>
                </div>
                <div class="bottom-bar">
                  <p class="text">File Name:</p><input type="text" class="filename" style="position:relative;" value="${filename}"><button class="save-button" style="margin-left:12px"><u>S</u>ave</button>
                </div>
                <!--<div class="bottom-bar">
                  <p class="text">Save as type:</p><div class="picker" style="margin:10px 0 10px 10px; width:200px;"><span class="arrow"></span><span>Portable Document File</span></div> <button id="cancel-button"><u>C</u>ancel</button>
                </div>-->
                <div class="bottom-bar">
                  <p class="text">Save as type:</p><select id="file-type" class="picker select" style="margin:0px 4px 10px 15px; width:230px; "><option value="pdf">PDF</option><option value="doc" selected>Word</option><option value="txt">Text Document</option></select> <button class="cancel-button"><u>C</u>ancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    $(notepadData).appendTo('#desktop').show('fast').draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    $(`#notepad-${this.processID}`).resizable({
      //alsoResize: a
    })
    $(`#notepad-${this.processID} #save`).draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    $(`#notepad-${this.processID} #open`).draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    return {
      windowID: `#notepad-${this.processID}`,
      description: this.description || 'Untitled - Notepad'
    };
  }
}