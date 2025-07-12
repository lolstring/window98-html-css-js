import { Application } from './application';
import { MsWord } from './msword';

export class MailClient extends Application {
  constructor(processID) {
    super(processID);
    this.toolbar();
    const { windowID, description } = this.create();
    this.windowID = windowID;
    this.description = description;
  }
  create() {
    return this.append();
  }
  append() {
    // if(file)
    // {
    // var iconUrl = programData.getIconByType(file.type);
    // attachData = `
    // <div fileID="${file.fileID}" class="attached-list">
    // <img class="icon" src="${iconUrl}"/>
    // <span>${file.filename}</span>
    // <div class="cancel" >
    // &nbsp;
    // </div>
    // </div>`;
    // }
    const mailID = `mail-${this.processID}`;
    const mailData = `<div id="mail-${this.processID}" class="mail window ui-widget-content" program-name="mail" style="display:block" pid="${this.processID}">
            <div class="window-border">
                <div class="title-bar  h-count" id="parent">
                    <div class="control-box">
                        <a class="button-3d minimize"><span>&nbsp;</span></a>
                        <a class="button-3d maximize" state="min"><span>&nbsp;</span></a>
                        <a class="button-3d close"><span>&nbsp;</span></a>
                    </div>
                    <span class="title">
                   Mail Client
                  </span>
                </div>
                <div class="top">
                    
                    <div class="menu-bar  h-count">
                    <span class="f-sep"></span>
                        <a><span>F</span>ile</a>
                        <a><span>E</span>dit</a>
                        <a><span>V</span>iew</a>
                        <a><span>I</span>nsert</a>
                        <a>F<span>o</span>ormat</a>
                        <a><span>T</span>ools</a>
                        <a><span>M</span>essage</a>
                        <a><span>H</span>elp</a>
                        <div class="clear"></div>
                    </div>
                    <span class="hr-sep"></span>
                    <div class="clear"></div>
                </div>
                <div class="mail-top-bar">
                    <span class="f-sep"></span>
                    <a class="b-send"></a>
                    <span class="sep"></span>
                    <a class="b-cut"></a>
                    <a class="b-copy"></a>
                    <a class="b-paste"></a>
                    <a class="b-undo"></a>
                    <span class="sep"></span>
                    <a class="b-attach"></a>
                </div>
                <div class="header-info">
                <div class="middle-bar">
                        <p class="to">To:</p>
                        <input type="text" class="sendTo" />
                </div>
                <div class="middle-bar">
                        <p class="cc">CC:</p>
                        <input type="text" class="sendToCC" />
                </div>
                <div class="middle-bar">
                        <p class="subject">Subject:&thinsp;</p>
                        <input type="text" class="subject" />
                </div>
                <div class="middle-bar">
                        <p class="attachment">Attach:&nbsp;&nbsp;</p>
                        <div class="attachment">
                		</div>
                </div>
                <div class="toolbar">
                    <select class="selectPicker" data-cmd="formatBlock" style="background-position:96% 50%, 99% 50%; width:112px; overflow:hidden; text-overflow: ellipsis;">
                        <option value="H1">
                            <h1>Heading 1</h1></option>
                        <option value="H2">
                            <h2>Heading 2</h2></option>
                        <option value="H3">
                            <h3>Heading 3</h3></option>
                        <option value="div"><pre>Normal</pre></option>
                        <option selected value="P">
                            <p>Default Paragraph Font</p>
                        </option>
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
                    <select class="selectPicker" id="fontSize" style="background-position:93% 50%, 96% 50%; width:64px; overflow:hidden;text-overflow: ellipsis;">
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12" selected>12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="22">22</option>
                        <option value="24">24</option>
                        <option value="26">26</option>
                        <option value="28">28</option>
                        <option value="30">30</option>
                        <option value="32">32</option>
                        <option value="34">34</option>
                        <option value="36">36</option>
                        <option value="48">48</option>
                        <option value="72">72</option>
                    </select>
                    <a class="b-bold" data-cmd="bold"></a>
                    <a class="b-italic" data-cmd="italic"></a>
                    <a class="b-underline" data-cmd="underline"></a>
                    <span class="sep"></span>
                    <a class="b-left" data-cmd="justifyLeft"></a>
                    <a class="b-center" data-cmd="justifyCenter"></a>
                    <a class="b-right" data-cmd="justifyRight"></a>
                    <span class="sep"></span>
                    <a class="b-number" data-cmd="insertOrderedList"></a>
                    <a class="b-bullet" data-cmd="insertUnorderedList"></a>
                    <a class="b-outdent" data-cmd="outdent"></a>
                    <a class="b-indent" data-cmd="indent"></a>
                </div>
                <div class="mail-content" contenteditable="true">
                </div>
                <div class="mail-bottom-bar"></div>
            </div>
          <div id="attach" class="ui-widget-content">
          <div class="window-border">
            <div class="title-bar  h-count">
              <div class="control-box">
                <a class="button-3d question-save disabled-action" tabindex="-1"><span>&nbsp;</span></a>
                <a class="button-3d close-save"><span>&nbsp;</span></a>
              </div>
              <span class="title">
                Attach
              </span>
            </div>
            <div class="attach-content">
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
                  <p class="text">File Name:</p><input type="text" class="filename" style="position:relative;"><button class="attach-button" style="margin-left:12px"><u>A</u>ttach</button>
                </div>
                <!--<div class="bottom-bar">
                  <p class="text">Save as type:</p><div class="picker" style="margin:10px 0 10px 10px; width:200px;"><span class="arrow"></span><span>Portable Document File</span></div> <button id="cancel-button""><u>C</u>ancel</button>
                </div>-->
                <div class="bottom-bar">
                  <p class="text">File of type:</p><select id="file-type" class="picker select" style="margin:0px 4px 10px 15px; width:230px; "><option value="pdf">PDF</option><option value="doc" selected>Word</option><option value="txt">Text Document</option></select> <button class="cancel-button"><u>C</u>ancel</button>
                </div>
                  <input type="hidden" class="fileID" value="">
                </div>
            </div>
          </div>
        </div>`;

    $(mailData).appendTo('#desktop').show('fast').draggable({
      handle: '.title-bar'
    });
    const a = `#${mailID} .mail-content`;
    $(`#mail${mailID}`).resizable({
      alsoResize: a
    });
    $(`#${mailID} #attach`).draggable({
      handle: '.title-bar'
    });
    return {
      windowID: `#mail-${this.processID}`,
      description: 'Mail Client'
    };
  }
  toolbar() {
    $('.toolbar a').on('mousedown', (e) => {
      e.stopPropagation();
      const el = $(e.currentTarget);
      const cmd = el.data('cmd');
      if (!cmd) return;
      e.preventDefault();
      try {
        document.execCommand(cmd, false, null);
      } catch (e) { }
    });
    $("select#fontSize").on('change', function (e) {

      const value = this.value;
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
      if (e.target !== this)
        return
      $('.color-picker').css('display', 'none');
      $(this).children().css('display', 'block');
      range = MsWord.selectHTML();

    });
    $('.toolbar .b-hilite').on('mouseup', (e) => {
      e.stopPropagation();
      let sel;
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

      if (e.target !== this)
        return
      $('.color-picker').css('display', 'none');
      $(this).children().css('display', 'block');
      range = MsWord.selectHTML();
    })
    $('.toolbar .b-fontcolor').on('mouseup', (e) => {
      //e.stopPropagation();
      let sel;
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

}