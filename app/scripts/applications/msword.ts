import { completeArr } from '../util';
import { removeArr } from '../util';
import { Kernel } from '../kernel';
import { SystemUI } from '../system-ui';
import { Application } from './application';

export class MsWord extends Application {
  fileID?: string;
  constructor(processID: number, fileID: string) {
    super(processID);
    this.fileID = fileID;
    this.processID = processID;
    const { windowID, description } = this.create();
    this.windowID = windowID;
    this.description = description;
    this.toolbar();
  }
  init() { }
  saveListener() {
    const doc = $(`[pid="${this.processID}"] .document-wrap`);
    const contents = $(doc).html();
    $(doc).blur(function () {
      if (contents !== $(this).html()) {
        $(this).closest('div[pid]').attr('saved', "false");
      }
    });

  }
  static execFontSize(size: string, unit: string) {
    const spanString = $('<span/>', {
      'text': document.getSelection()
    }).css('font-size', size + unit).prop('outerHTML');
    document.execCommand('insertHTML', false, spanString);
  }
  static selectHTML() {
    let sel: Selection;
    $('.document-wrap').trigger('blur');
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }
    return null;
  }
  toolbar() {
    $('.toolbar a').on('mousedown', (e) => {
      $('.document-wrap').trigger('blur');
      e.stopPropagation();
      const el = $(e.currentTarget);

      const cmd = el.data('cmd');
      if (!cmd) return;
      e.preventDefault();
      try {
        document.execCommand(cmd, false, null);
      } catch (e) {
        console.log(e);
      }
    });
    $("select").on('mousedown', function (e) {
      e.stopPropagation();
      if (e.target !== this)
        return
      range = MsWord.selectHTML();
    })
    $("select#fontSize").on('change', (e) => {
      let sel: Selection;
      if (range) {
        if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      e.stopPropagation();
      const el = $(e.currentTarget);
      const value = el.val().toString();
      //if (!cmd) return;
      //e.preventDefault();
      try {
        MsWord.execFontSize(value, "px");
      } catch (e) {
        console.log(e);
      }
    });

    $("select.selectPicker").on('change', (e) => {
      const el = $(e.currentTarget);
      const cmd = el.data('cmd');
      const value = el.val().toString();
      if (!cmd) return;
      e.preventDefault();
      try {
        document.execCommand(cmd, false, value);
      } catch (e) {
        console.log(e);
      }
    });
    let range = null;
    $(".toolbar .b-paste").on('mousedown', (e) => {
      e.stopPropagation();
      document.execCommand("paste", false, null);
      //var clipboardText = clipboardData.getData('Text/html');
      //document.execCommand('insertHTML', false, null);
    });
    $(".toolbar .b-paste").on('mouseup', () => {
      //$(this).focus().execCommand("paste",false,null);

    });

    $('.toolbar .b-hilite').on('mousedown', function (e) {
      e.stopPropagation();
      $('.document-wrap').blur();
      if (e.target !== this)
        return
      $('.color-picker').css('display', 'none');
      $(this).children().css('display', 'block');

      range = MsWord.selectHTML();

    });
    $('.toolbar .b-hilite').on('mouseup', (e) => {
      e.stopPropagation();
      let sel: Selection;
      $('.document-wrap').blur();
      if (range) {

        if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });


    $('.toolbar .b-hilite .color-picker a').on('mousedown', function (e) {
      //e.stopPropagation();
      $('.document-wrap').blur();
      const color = $(this).css('background-color');
      $(this).closest('div').css('display', 'none');
      /*	$.getScript('js/forecolor.js', function() {
              ColorizeSelection(color);
          });*/
      try {
        document.execCommand('backColor', false, color);
      } catch (e) {
        console.log('No Support', e);
      }

      e.stopPropagation();
    });
    $('.toolbar .b-fontcolor').on('mousedown', function (e) {
      $('.document-wrap').blur();
      if (e.target !== this)
        return
      $('.color-picker').css('display', 'none');
      $(this).children().css('display', 'block');
      range = MsWord.selectHTML();
    })
    $('.toolbar .b-fontcolor').on('mouseup', (e) => {
      //e.stopPropagation();
      let sel: Selection;
      $('.document-wrap').blur();
      if (range) {
        if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      e.stopPropagation();
    });

    $('.toolbar .b-fontcolor .color-picker a').on('mousedown', function (e) {
      const color = $(this).css('background-color');
      $(this).closest('div').css('display', 'none');

      /*	$.getScript('js/forecolor.js', function() {
              ColorizeSelection(color);
          });*/
      try {
        document.execCommand('foreColor', false, color);
      } catch (e) {
        console.log('No Support', e);
      }
      e.stopPropagation();

    });
  }
  create() {
    const docNumber = MsWord._wordNumberStore();
    let content: string;
    let filename: string;
    let type: string;
    let description: string;
    if (this.fileID) {
      //log(this.fileID);
      //var file = this.filename.split('.');
      const file = Kernel.getFileFromLocal(this.fileID);
      description = `${file.filename} - Microsoft Word`;
      content = file.content;
      filename = file.filename;
      type = file.type;
    } else {
      description = `Document ${docNumber} - Microsoft Word`;
      content = '<div class="clear"></div>';
      filename = `Document ${docNumber}`;
      type = '';
    }
    const a = this.append(docNumber, filename, content, type, description);
    this.saveListener();
    //SystemUI.setWindowPosition(a);
    return {
      windowID: a,
      description: description
    };
  }
  static _wordNumberStore() {
    const num = JSON.parse(localStorage.getItem('docNumber'));
    const docNumber = completeArr(num);
    localStorage.setItem('docNumber', JSON.stringify(num));
    return docNumber;
  }
  static _wordNumberRemove(v: string) {
    const intV = Number.parseInt(v);
    const num = JSON.parse(localStorage.getItem('docNumber'));
    removeArr(num, intV);
    localStorage.setItem('docNumber', JSON.stringify(num));
    return true;
  }
  append(docNumber: number, filename: any, content: any, _type: any, description: any) {
    let cd = 'contenteditable="true"';
    let d = description;
    if (this.fileID === 'file-0000000000001' || this.fileID === 'file-0000000000002') {
      cd = '';
      d = `${description} (Read Only)`;
    }
    const docData =
      `<div id="word-${docNumber}" class="word window ui-widget-content" pid="${this.processID}" program-name="msword" document-number=${docNumber} fileID=${this.fileID} document-title=${d} saved="true">
        <div class="window-border">
          <div class="title-bar  h-count" id="parent">
            <div class="control-box">
              <a class="button-3d minimize"><span>&nbsp;</span></a>
              <a class="button-3d maximize" state="min"><span>&nbsp;</span></a>
              <a class="button-3d close"><span>&nbsp;</span></a>
            </div>
            <span class="title">
              ${d}
            </span>
          </div>
          <div class="menu-bar  h-count">
            <a class="file"><span>F</span>ile</a>
            <a class="disabled-action"><span>E</span>dit</a>
            <a class="disabled-action" tabindex="-1"><span>V</span>iew</a>
            <a class="disabled-action" tabindex="-1"><span>I</span>nsert</a>
            <a class="disabled-action" tabindex="-1">F<span>o</span>rmat</a>
            <a class="disabled-action" tabindex="-1"><span>T</span>ools</a>
            <a class="disabled-action" tabindex="-1">T<span>a</span>ble</a>
            <a class="disabled-action" tabindex="-1"><span>W</span>indow</a>
            <a class="disabled-action" tabindex="-1"><span>H</span>elp</a>
            <div class="clear"></div>
          </div>
          <div class="toolbar float-left">
            <a class="b-new" tabindex="0"></a>
            <a class="b-open" tabindex="0"></a>
            <a class="b-save" tabindex="0"></a>
            <span class="sep"></span>
            <a class="b-print" tabindex="0"></a>
            <a class="b-preview" tabindex="0"></a>
            <a class="b-spell disabled-action-toolbar" tabindex="-1"></a>
            <span class="sep"></span>
            <a class="b-cut" data-cmd="cut" tabindex="0"></a>
            <a class="b-copy" data-cmd="copy" tabindex="0"></a>
            <a class="b-paste disabled-action-toolbar"  tabindex="-1" data-cmd="paste"></a>
            <a class="b-style-brush disabled-action-toolbar"  tabindex="-1"></a>
            <span class="sep"></span>
            <a class="b-undo" data-cmd="undo" tabindex="0"></a>
            <a class="b-redo"  data-cmd="redo" tabindex="0"></a>
            <div class="clear"></div>
          </div>
          <div class="toolbar  float-left">
            <select class="selectPicker" data-cmd="formatBlock" style="background-position:96% 50%, 98% 50%; width:112px; overflow:hidden; text-overflow: ellipsis;">
              <option value="H1"><h1>Heading 1</h1></option>
              <option value="H2"><h2>Heading 2</h2></option>
              <option value="H3"><h3>Heading 3</h3></option>
              <option value="div"><pre>Normal</pre></option>
              <option selected value="P"><p>Default Paragraph Font</p></option>
            </select>
            <select class="selectPicker" id="font" data-cmd="fontName" style="width:168px; overflow:hidden; text-overflow: ellipsis;">
              <option value="Arial" selected>Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial Black">Arial Black</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Lucida Console">Lucida Console</option>
            </select>
            <select class="selectPicker" id="fontSize" style="background-position:92% 50%, 95% 50%; width:64px; overflow:hidden;text-overflow: ellipsis;">
              <option value="8" >8</option>
              <option value="9" >9</option>
              <option value="10" >10</option>
              <option value="11" >11</option>
              <option value="12" selected >12</option>
              <option value="14" >14</option>
              <option value="16" >16</option>
              <option value="18" >18</option>
              <option value="20" >20</option>
              <option value="22" >22</option>
              <option value="24" >24</option>
              <option value="26" >26</option>
              <option value="28" >28</option>
              <option value="30" >30</option>
              <option value="32" >32</option>
              <option value="34" >34</option>
              <option value="36" >36</option>
              <option value="48" >48</option>
              <option value="72" >72</option>
              
            </select>
          </div>
          <div class="toolbar  float-left">
            <a class="b-bold" data-cmd="bold" tabindex="0"></a>
            <a class="b-italic" data-cmd="italic" tabindex="0"></a>
            <a class="b-underline"  data-cmd="underline" tabindex="0"></a>
            <span class="sep"></span>
            <a class="b-left"  data-cmd="justifyLeft" tabindex="0"></a>
            <a class="b-center" data-cmd="justifyCenter" tabindex="0"></a>
            <a class="b-right" data-cmd="justifyRight" tabindex="0"></a>
            <span class="sep"></span>
            <a class="b-number" data-cmd="insertOrderedList" tabindex="0"></a>
            <a class="b-bullet" data-cmd="insertUnorderedList" tabindex="0"></a>
            <a class="b-outdent" data-cmd="outdent" tabindex="0"></a>
            <a class="b-indent" data-cmd="indent" tabindex="0"></a>
            <span class="sep"></span>
            <a class="b-hilite" data-cmd="backColor" tabindex="0">
              <div class="color-picker" style="position:fixed; background:#c0c0c0; z-index:99; display:none;">
                <table>
                  <tr>
                    <td colspan="8" style="padding:3px"><a style="background:none; border:1px solid; width:100%; height:100%; text-align:center; vertical-align:middle;font-size:10px">None</a></td>
                  </tr>
                  <tr>
                    <td><a style="background:black"></a></td>
                    <td><a style="background:darkgrey">&nbsp;</a></td>
                    <td><a style="background:darkred">&nbsp;</a></td>
                    <td><a style="background:#808088">&nbsp;</a></td>
                    <td><a style="background:darkgreen">&nbsp;</a></td>
                    <td><a style="background:teal">&nbsp;</a></td>.
                    <td><a style="background:darkblue">&nbsp;</a></td>
                    <td><a style="background:violet">&nbsp;</a></td>
                  </tr>
                  <tr>
                    <td><a style="background:white">&nbsp;</a></td>
                    <td><a style="background:lightgrey">&nbsp;</a></td>
                    <td><a style="background:red">&nbsp;</a></td>
                    <td><a style="background:yellow">&nbsp;</a></td>
                    <td><a style="background:green">&nbsp;</a></td>
                    <td><a style="background:lightblue">&nbsp;</a></td>
                    <td><a style="background:darkblue">&nbsp;</a></td>
                    <td><a style="background:pink">&nbsp;</a></td>
                  </tr>
                </table>
              </div>
            </a>
            <a class="b-fontcolor"  tabindex="0">
              <div class="color-picker" style="position:fixed; background:#c0c0c0; z-index:99; display:none;">
                <table>
                  <tr>
                    <td colspan="8" style="padding:3px"><a style="background:black;background-size:10px,10px; border:1px solid; width:100%; height:100%; text-align:center; vertical-align:middle;color:white;">Automatic</a></td>
                  </tr>
                  <tr>
                    <td><a style="background:black"></a></td>
                    <td><a style="background:darkgrey">&nbsp;</a></td>
                    <td><a style="background:darkred">&nbsp;</a></td>
                    <td><a style="background:#808088">&nbsp;</a></td>
                    <td><a style="background:darkgreen">&nbsp;</a></td>
                    <td><a style="background:teal">&nbsp;</a></td>.
                    <td><a style="background:darkblue">&nbsp;</a></td>
                    <td><a style="background:violet">&nbsp;</a></td>
                  </tr>
                  <tr>
                    <td><a style="background:white">&nbsp;</a></td>
                    <td><a style="background:lightgrey">&nbsp;</a></td>
                    <td><a style="background:red">&nbsp;</a></td>
                    <td><a style="background:yellow">&nbsp;</a></td>
                    <td><a style="background:green">&nbsp;</a></td>
                    <td><a style="background:lightblue">&nbsp;</a></td>
                    <td><a style="background:darkblue">&nbsp;</a></td>
                    <td><a style="background:pink">&nbsp;</a></td>
                  </tr>
                </table>
              </div>
            </a>
            <div class="clear"></div>
          </div>
          <div class="clear"></div>
          <div id="word-${docNumber}-content" class="content ui-widget-content">
            <div class="content-box">
              <div class="top-ruler  h-count">
                <div class="ruler"></div>
              </div>
              <div class="left-ruler"></div>
              <div class="document-scroller">
                <div class="document-content">
                  <div class="document container">
                    <div class="document-wrap" ${cd} tabindex="0">
                      ${content}
                      <div class="clear"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="status-bar disable-action h-count" id="status-bar-1">
            <div class="status-bar-content">
              <span class="box">
                Page 1
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Sec 1
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                1/1
                &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span class="box">
                At 1"
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Ln 1
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Col 1
                &nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span class="box disabled">
                REC
              </span>
              <span class="box disabled">
                TRK
              </span>
              <span class="box disabled">
                EXT
              </span>
              <span class="box disabled">
                OVR
              </span>
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

    $(docData).appendTo('#desktop').show('fast').draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    const a = `#word-${docNumber}-content .document-content`;
    $(`#word-${docNumber}`).resizable({
      alsoResize: a
    })
    $(`#word-${docNumber} #save`).draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    $(`#word-${docNumber} #open`).draggable({
      handle: '.title-bar',
      containment: "#desktop",
      scroll: false
    });
    return `#word-${docNumber}`;
  }
  // getFileFromLocal(fileID) {
  // 	var contentDocument;
  // 	var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
  // 		return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
  // 	});
  // 	if (result.length == 1) {
  // 		var localData = result[0];
  // 	}
  // 	for (var i = 0; i < localData.files.length; i++) {
  // 		if (fileID === localData.files[i].fileID) {
  // 			contentDocument = localData.files[i];
  // 			console.log("gotFile");
  // 			break;
  // 		}
  // 	}
  // 	return contentDocument;
  // }
  static remove(docNumber: string, callback: (result: boolean) => void) {
    const parentID = `word-${docNumber}`;
    const saved = $(`#${parentID}`).attr('saved');
    if (saved === 'false') {
      SystemUI.setDialogBox(parentID, 'Microsoft Word', '4', 'Are you sure you want to close before exiting?');
      $(`#${parentID} #dialog button`).on('click', function () {
        $(`#${parentID}`).css('pointer-events', 'auto');
        const d = $(this).attr('value');

        if (d === "yes") {
          MsWord._wordNumberRemove(docNumber);
          callback(true);
        } else if (d === "no") {
          callback(false);
        } else if (d === "cancel") {
          callback(false);
        }
      });
    } else {
      MsWord._wordNumberRemove(docNumber);
      callback(true);
    }
  }
}