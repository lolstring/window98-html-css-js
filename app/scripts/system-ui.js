import { process } from "./process";
import { isFirstLogin } from "./util";
import { MsWord } from "./msword";
import { Explorer } from "./explorer";
import { Notepad } from "./notepad";
import { Minesweeper } from "./minesweeper";
import { Wolf3d } from "./wolf3d";
import { Winamp } from "./winamp";
import { MailClient } from "./mail-client";
import { programData } from "./program-data";
import { kernel } from "./kernel";
import { sound } from './sound';

let zIndex = 100;

export class SystemUI extends process {
  init() {
    this.windowInitalPositionValues();
    this.contextMenuInit();
    this.runInit();
  }
  eventListeners() {
    /**
     * Desktop Icons
     */
    const self = this;
    //----------------------------------------------- DESKTOP ICON EVENT LISTENERS -----------------------------------------//
    $("#desktop").on("focus click", ".desktop-icon", function () {
      if ($(this).hasClass("disabled")) return 0;
      $(".desktop-icon").children().removeClass("active");
      $(this).children().addClass("active");
    });
    $("#desktop").on("focusout", ".desktop-icon", function () {
      if ($(this).hasClass("disabled")) return 0;
      $(".desktop-icon").children().removeClass("active");
    });
    $("#desktop").on("dblclick touchend", ".desktop-icon", function (e) {
      if ($(this).hasClass("disabled")) return 0;
      e.stopPropagation();
      e.preventDefault();
      //console.log(e);
      self.program(this);
    });

    //----------------------------------------------- MAIN WINDOW EVENTS -----------------------------------------//
    /**
     * Universal Window Minimize
     *
     * @param  {window}
     * @return {nothing}
     */

    $("#desktop").on("click", ".minimize", function () {
      const pid = $(this).closest("[pid]").attr("pid");
      self.minimize(pid);
    });
    /**
     * Universal Window Minimize
     *
     * @param  {window}
     * @return {nothing}
     */
    $("#desktop").on("click", ".maximize", function () {
      //$('#desktop').trigger('beforeMinimize');
      const pid = $(this).closest("[pid]").attr("pid");
      self.maximize(pid);
    });

    /**
     * Universal Window Close
     *
     * @param  {window}
     * @return {nothing}
     */
    $("#desktop").on("click", ".close", function () {
      self.close(this);
      $(this).css("pointer-events", "auto");
    });
    /*
        Universal set active.
     */

    $("#desktop").on("mousedown", ".window", function (e) {
      e.stopPropagation();

      //e.preventDefault();
      if (!(e.currentTarget.id === "dialog")) {
        self.setActive($(this).attr("pid"));
      }
    });

    $("#desktop").on("resizestop", ".window", function (_event, ui) {
      $(this).data({
        originalTop: ui.position.top,
        originalLeft: ui.position.left,
        originalDisplay: $(this).css("display"),
        originalPosition: $(this).css("position"),
        originalHeight: ui.size.height,
        originalWidth: ui.size.width,
        originalOpacity: $(this).css("opacity"),
      });
    });
    $("#desktop").on(
      "dblclick",
      ".ui-resizable > div.window-border > .title-bar > .title",
      function () {
        const pid = $(this).closest("[pid]").attr("pid");
        self.maximize(pid);
      },
    );

    // ------------------------------------------------ msword events(So Event's are not init everytime new word) -----------------------------------------------//

    $("#desktop").on("click", ".b-new", () => {
      self.newWord();
    });
    $("#desktop").on("click", ".b-save", function (e) {
      e.preventDefault();
      const parentId = $(this).closest("[id]").attr("id");
      self.showSave(parentId);
      // var saveSel = '#' + parentId + ' #save';
      // $(saveSel).css('display', 'block');
      // // .draggable({
      // // 	handle: '.title-bar'
      // // });
      // self.updateContentBox(saveSel);
      // var offset = $(saveSel).offset();
      // $(saveSel).css({
      // 	"top": offset.top,
      // 	"left": offset.left,
      // 	"position": "fixed"
      // });
      // $('#' + parentId).closest('[id]').css('pointer-events', 'none');
      // $(saveSel).css('pointer-events', 'auto');
      //$(this).draggable('disable');
      //$(this + "#save").css('left',offset.left);
    });
    $("#desktop").on("click", ".b-open", function (e) {
      e.preventDefault();
      const parentId = $(this).closest("[id]").attr("id");
      self.showOpen(parentId);
      // var openSel = '#' + parentId + ' #open';
      // $(openSel).css('display', 'block');
      // // .draggable({
      // // 	handle: '.title-bar'
      // // });
      // self.updateContentBox(openSel);
      // var offset = $(openSel).offset();
      // $(openSel).css({
      // 	"top": offset.top,
      // 	"left": offset.left,
      // 	"position": "fixed"
      // });
      // $('#' + parentId).closest('[id]').css('pointer-events', 'none');
      // $(openSel).css('pointer-events', 'auto');
      // //$(this).draggable('disable');
      // //$(this + "#save").css('left',offset.left);
    });
    $("#desktop").on("click", ".b-print", function () {
      const parentId = $(this).closest("[id]").attr("id");
      self.printFile(parentId);
    });
    //------------------------------------------------ Mail Events -------------------------------------------------------//

    $("#desktop").on("click", ".b-attach", function (e) {
      e.preventDefault();
      const parentId = $(this).closest("[id]").attr("id");
      const attachSel = `#${parentId} #attach`;
      $(attachSel).css("display", "block");
      // .draggable({
      // 	handle: '.title-bar'
      // });
      self.updateContentBox(attachSel);
      const offset = $(attachSel).offset();
      $(attachSel).css({
        top: offset.top,
        left: offset.left,
        position: "fixed",
      });
      $(`#${parentId}`).closest("[id]").css("pointer-events", "none");
      $(attachSel).css("pointer-events", "auto");
    });
    $("#desktop").on("click", ".attachment .cancel", function () {
      $(this).parent().remove();
    });
    $("#desktop").on("click", ".b-send", function (e) {
      e.preventDefault();
      self.sendEmail($(this).closest("[id]").attr("id"));
    });
    //------------------------------------------------- RUN EVENTS -------------------------------------------------//
    $("#menu-8").on("click", () => {
      $("#run").draggable({
        handle: ".title-bar",
      });
      self.setActive($("#run").attr("pid"));
    });
    $("#run .ok-button").on("click", function () {
      if ($(this).val() === "ok") {
        self.runProgram($("#run input").val());
      } else {
        $("#run").css("display", "none");
      }
    });
    $("#run .close-run,#run .close-button").on("click", function () {
      const pid = $(this).closest("[pid]").attr("pid");
      self.beforeWindow(pid, () => {
        self.programMinimize(pid);
      });
    });
    //------------------------------------------------ Explorer Events ----------------------------------------//
    $("#desktop").on("focus click", ".folder-icon", function () {
      if ($(this).hasClass("folder-url")) return;
      $(".folder-icon").children().removeClass("active");
      $(this).children().addClass("active");
      //setting file size
      const p1 = $(this).closest("[pid]").attr("id");
      const file = kernel.getFileFromLocal($(this).attr("fileid"));
      const size = Math.round((JSON.stringify(file).length * 2) / 1024);
      $(`#${p1} .box.size`).text(`${size} KB`);
    });
    $("#desktop").on("focusout", ".folder-icon", function () {
      if ($(this).hasClass("folder-url")) return;
      $(".folder-icon").children().removeClass("active");
      const p1 = $(this).closest("[pid]").attr("id");
      $(`#${p1} .box.size`).text("");
    });
    $("#desktop").on("dblclick touch", ".folder-icon", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(this).hasClass("folder-url")) return;
      self.program(this);
    });
    $("#desktop").on("dblclick touch", ".folder-url", function (e) {
      e.preventDefault();
      e.stopPropagation();

      window.open($(this).attr("url"));
    });
    //------------------------------------------------ Properties Events --------------------------------------//
    $("#desktop").on("click", ".properties .button", function () {
      const parentID = $(this).closest("[id]").attr("id");
      $(`#${parentID} .close`).trigger("click");
    });
    //----------------------------------------------- Menu Events ----------------------------------------------------//
    $("#menu-10").on("click", () => {
      self.shutdown();
    });
    $("#menu-9")
      .off()
      .on("click", () => {
        self.beforeLogoff();
      });
    $(".sub-menu-item").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      self.program(this);
    });
    //----------------------------------------------- SAVE/OPEN/ATTACH WINDOW EVENTS -----------------------------------------//
    /**
     * Save/Open Window Close
     *
     * @param  {window}
     * @return {nothing}
     */
    $("#desktop").on("click", ".close-save,	.cancel-button", function () {
      const parentId = $(this).closest("[id]").attr("id");
      const fatherId = $(this)
        .closest("[id]")
        .parent()
        .closest("[id]")
        .attr("id");

      $(`#${fatherId} #${parentId}`).css("display", "none");
      $(`#${fatherId}`).css("pointer-events", "auto");
    });

    $("#desktop").on("click", ".save-button", function () {
      debugger;
      self.save(this);
    });
    $("#desktop").on("click", ".desktop-ico", function () {
      $(this).siblings("#save-location").val("desktop");
    });
    $("#desktop").on("click", ".open-button", function () {
      self.open(this);
    });
    $("#desktop").on("click", ".attach-button", function () {
      self.attach(this);
    });
    let lol;
    $("#desktop").on("click", ".user-file-list", function (e) {
      //$('.user-file-list').children().css('background', 'none');
      const a = $(this).children().text();
      lol = $(this).attr("type");
      const file = $(this).attr("fileid");
      const windowType = $(this).closest("[id]").attr("id");
      if (e.shiftKey) {
        if (windowType === "attach") {
          $(this).addClass("selected");
          const oldVal = $(this).closest("[id]").find(".fileID").val();
          let oldVal1 = $(this).closest("[id]").find(".filename").val();
          if (oldVal1.indexOf('"') < 0) oldVal1 = `"${oldVal1}"`;
          //var oldVal2 = $(this).closest('[id]').find('#file-type').val();
          $(this).closest("[id]").find(".filename").val(`${oldVal1} "${a}"`);
          $(this).closest("[id]").find(".fileID").val(`${oldVal}|${file}`);
          $(this).closest("[id]").find("#file-type").val("none");
        } else {
          $(".user-file-list").removeClass("selected");
          $(this).closest("[id]").find(".filename").val(a);
          $(this).closest("[id]").find("#file-type").val(lol);
          $(this).closest("[id]").find(".fileID").val(file);
        }
      } else {
        $(".user-file-list").removeClass("selected");
        $(this).toggleClass("selected");
        $(this).closest("[id]").find(".filename").val(a);
        $(this).closest("[id]").find("#file-type").val(lol);
        $(this).closest("[id]").find(".fileID").val(file);
      }
      // var a = $(this).children().text();
      // var lol = $(this).attr('type');
      // var file= $(this).attr('fileid');
      // $(this).parent().parent().find('.filename').val(a);
      // $(this).parent().parent().find('#file-type').val(lol);
      // //$(this).children().css('background', 'blue');
      // var windowType = $(this).parent().closest('id').attr('id');;
      // if(windowType == "attach"){
      // 	if(e.shiftKey){
      // 	$(this).toggleClass('selected');
      // 	var oldVal = $(this).parent().find('.fileID').val();
      // 	console.log(oldVal);
      // 	$(this).parent().parent().find('.fileID').val(oldVal+'|'+$(this).attr('fileid'));
      // 	}
      // 	else{
      // 		$('.user-file-list').removeClass('selected');
      // 		$(this).parent().parent().find('.fileID').val(fileID);
      // 	}
      // }
    });
    $("#desktop").on("blur", ".user-file-list", () => {
      //$('.user-file-list').children().css('background', 'none');
    });

    //----------------------------------------------- DIALOG WINDOW EVENTS -----------------------------------------//
    $("#dialog button").on("click", () => { });

    //----------------------------------------------- TaskBar Events ----------------------------------------------//		//
    $("#menu-2").hover(
      () => {
        $("#sub-menu-2").css("display", "block");
      },
      () => {
        $("#sub-menu-2").hover(
          () => {
            $("#sub-menu-2").css("display", "block");
          },
          () => {
            $("#sub-menu-2").css("display", "none");
          },
        );
      },
    );
    $(document).mouseup((e) => {
      const container = $("#start-menu");

      if (
        !container.is(e.target) && // if the target of the click isn't the container...
        container.has(e.target).length === 0
      ) {
        // ... nor a descendant of the container
        container.slideUp();
        //container.css("z-index", "400000");
        $("#sub-menu-2").css("display", "none");
      }
    });
    $("#start-menu").on("click", () => {
      if ($("#start-menu").css("display") === "block") {
        $("#start-menu").slideUp();
      } else {
        $("#start-menu").slideDown();
      }
    });
    //Test
    $(document).on("click", "#start-button", () => {
      if ($("#start-menu").css("display") === "block") {
        //$("#start-menu").css("z-index", "600000");
        $("#start-menu").slideUp();
        //$("#start-menu").css("z-index", "400000");
        //$("#start-menu").css("display","none");
      } else {
        //open
        //$("#start-menu").css("z-index","60");
        $("#start-menu").slideDown();
        // setTimeout(function() {
        //     $("#start-menu").css("z-index", "600000");
        // }, 800);

        //$("#start-menu").css("display","block");
      }
    });

    $("#menu-2").hover(
      () => {
        $("#sub-menu-2").css("display", "block");
      },
      () => {
        $("#sub-menu-2").hover(
          () => {
            $("#sub-menu-2").css("display", "block");
          },
          () => {
            $("#sub-menu-2").css("display", "none");
          },
        );
      },
    );
    $("#desktop").on("click", ".window-open", function (e) {
      e.preventDefault();
      const pid = $(this).attr("pid");
      //console.log('lol' + $(this).attr('id').replace('task-', ''));
      if (!$(`.window[pid="${pid}"]`).is(":animated")) {
        if ($(this).hasClass("active-task")) {
          self.setInActive(pid);
        } else {
          self.setActive(pid);
        }
      } else {
        setTimeout(() => {
          if ($(this).hasClass("active-task")) {
            self.setInActive(pid);
          } else {
            self.setActive(pid);
          }
        }, 800);
      }
    });
    $("#taskbar .show-desktop").on("click", () => {
      $(".window").each(function () {
        if ($(this)[0].hasAttribute("pid")) {
          self.minimize($(this).attr("pid"));
        }
      });
    });
    $("#taskbar .new-mail").on("click", () => {
      self.newMail();
    });
    $("#pageup").on("click", () => {
      self.upTaskPage();
    });
    $("#pagedown").on("click", () => {
      self.downTaskPage();
    });
  }
  //----------------------------------------------- MAIN SYSTEM FUNCTIONS -----------------------------------------//
  /**
   * MAIN SYSTEM UI FUNCTION.
   *
   * Program instintiator.
   *
   * @param  {selector}
   * @return {nothing}
   */
  program(iconSelector) {
    const selector = $(iconSelector);
    const program = selector.attr("program-name");
    const fileID = selector.attr("fileid");
    let p;
    let processID = this.isOpen(fileID);
    if (processID != null || typeof processID !== "undefined") {
      // console.log('processID' + processID);
      this.setActive(processID);
    } else {
      processID = super.newProcess();
      switch (program) {
        case "msword":
          p = new MsWord(processID, fileID);
          if (this.botOpen === false) {
            globalBot.agent((a) => {
              a.moveTo($(window).width() * 0.75, $(window).height() * 0.75);
              a.speak(
                "This is Microsoft Word. You can edit files and save them to the desktop which is internally stored to Local Storage. Be careful when you clear cache. You can also download the file to your own computer.",
              );
            });
            this.botWord = true;
          }
          break;
        case "notepad":
          p = new Notepad(processID, fileID);
          break;
        case "mail":
          globalBot.agent((a) => {
            a.moveTo($(window).width() * 0.75, $(window).height() * 0.75);
            a.speak(
              "Welcome to the mail client. You can compose emails here. If you want to get in touch with me contact me on rahulmehra@techgeek.co.in.",
            );
          });
          p = new MailClient(processID);
          break;
        case "wolf-3d": {
          const a = this.isRunning(program);
          if (!a) {
            p = new Wolf3d(processID);
          } else {
            this.setActive(a);
          }
          break;
        }
        case "minesweeper": {
          const a = this.isRunning(program);
          if (!a) {
            p = new Minesweeper(processID);
          } else {
            this.setActive(a);
          }
          break;
        }
        case "winamp": {
          const a = this.isRunning(program);
          if (!a) {
            p = new Winamp(processID);
          } else {
            this.setActive(a);
          }
          break;
        }
        case "recyclebin":
          this.beforeLogoff(true);
          break;
        case "explorer":
          p = new Explorer(processID, selector.attr("directory"));
          break;
      }
      if (p) {
        super.addProcess(processID, program, p.windowID, p.description);
        this.setWindowPosition(p.windowID);
        this.appendTask(processID, program, p.windowID, p.description);
        this.setActive(processID);
      } else {
        console.log("No Process Returned");
      }
    }
  }
  isOpen(fileID) {
    let processID;
    let wfileID;
    // if ($('.window[fileid="' + fileID + '"]').length != 0) {
    //     processID = $('.window[fileid="' + fileID + '"]').attr('pid');
    // }
    // return processID;
    $(".window").each(function () {
      const $w = $(this);
      wfileID = $w.attr("fileid");
      if (fileID === wfileID) {
        processID = $w.attr("pid");
        return false;
      }
    });
    return processID;
  }
  isRunning(program) {
    let a = false;
    if ($(`.window[program-name="${program}"]`).length !== 0) {
      a = $(`.window[program-name="${program}"]`).attr("pid");
    }
    // $('.window').each(function(){
    // 	if($(this).attr('program-name')===program){
    // 		a = $(this).attr('pid');
    // 	}
    // })
    return a;
  }
  close(closeButton) {
    let windowID = $(closeButton).closest("[pid]").attr("id");
    windowID = `#${windowID}`;
    const pid = $(windowID).attr("pid");
    const program = $(windowID).attr("program-name");
    switch (program) {
      case "msword":
        MsWord.remove($(windowID).attr("document-number"), (close) => {
          this.programClose(pid, close);
        });
        break;
      default:
        this.programClose(pid, true);
    }
  }
  properties(fileID) {
    const processID = super.newProcess();
    this.newProperties(processID, fileID);
  }
  newProperties(processID, fileID) {
    const file = this.getFileFromLocal(fileID);
    const size = JSON.stringify(file).length * 2;
    const cdate = new Date(file.creationDate);
    //var created = cdate.getDay() + ', ' + cdate.getMonth() + cdate.getDate() +', '+ cdate.getFullYear() +' '+ cdate.getHours() +':'+cdate.getMinutes()+':'+cdate.getSeconds()+' ';
    const created = `${cdate.toDateString()}, ${cdate.toLocaleTimeString()}`;
    const mdate = new Date(file.modifiedDate);
    //var modified = mdate.getDay() + ', ' + mdate.getMonth() + mdate.getDate() +', '+ mdate.getFullYear() +' '+ mdate.getHours() +':'+mdate.getMinutes()+':'+mdate.getSeconds()+' '+mdate.getHours() >= 12 ? 'PM' : 'AM';
    const modified = `${mdate.toDateString()}, ${mdate.toLocaleTimeString()}`;
    const iconURL = programData.getIconByType(file.type);
    const propertiesData = `<div id="properties-${processID}" class="properties window ui-widget-content" program-name="properties" pid="${processID}">
            <div class="window-border">
                <div class="title-bar h-count" id="parent">
                    <div class="control-box">
                        <a class="button-3d close"><span>&nbsp;</span></a>
                    </div>
                    <span class="title">
                    ${file.filename} Properties
                </span>
                </div>
                <div class="properties-content">
                    <div class="tab">General</div>
                    <div class="content">
                        <div class="top"><img class="icon" src="${iconURL}" />
                            <p class="filename">${file.filename}</p>
                        </div>
                        <div class="sep"></div>
                        <div class="middle">
                            <table>
                                <tr>
                                    <th>Type:</th>
                                    <td class="type">${file.type}</td>
                                </tr>
                                <tr>
                                    <th>Location:</th>
                                    <td class="location">Desktop/</td>
                                </tr>
                                <tr>
                                    <th>Size:</th>
                                    <td class="size">${size} Bytes</td>
                                </tr>
                            </table>
                        </div>
                        <div class="sep"></div>
                        <div class="middle2">
                            <table>
                                <tr>
                                    <th>MS-DOS name:</th>
                                    <td class="msdos">${file.filename}.${file.type}</td>
                                </tr>
                                <tr>
                                    <th>Created:</th>
                                    <td class="created">${created}</td>
                                </tr>
                                <tr>
                                    <th>Modified:</th>
                                    <td class="modified">${modified}</td>
                                </tr>
                                <tr>
                                    <th>Accessed:</th>
                                    <td class="accessed">${modified}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="sep"></div>
                        <div class="attributes">
                            <table>
                                <tr>
                                    <th>Attributes:</th>
                                    <td><div class="square">&nbsp;</div></td>
                                    <td>Read-only</td>
                                    <td><div class="square">&nbsp;</div></td>
                                    <td>Hidden</td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td><div class="square">&nbsp;</div></td>
                                    <td>Archive</td>
                                    <td><div class="square">&nbsp;</div></td>
                                    <td>System</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="bottom">
                        <button class="button disabled-action" tabindex="-1">Apply</button>
                        <button class="button close-button" value="cancel">Cancel</button>
                        <button class="button ok-button" value="ok">Ok</button>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
        </div>`;
    $(propertiesData).appendTo("#desktop").show("fast").draggable({
      handle: ".title-bar",
    });
    const off = $(`.desktop-icon[fileid="${file.fileID}"]`).offset();
    off.top =
      off.top >= $(window).height() / 2 ? $(window).height() / 2 - 32 : off.top;
    $(`#properties-${processID}`).css({
      top: off.top + 32,
      left: off.left + 32,
    });
    this.setActive(processID);
  }
  maximize(pid) {
    const windowID = $(`.window[pid="${pid}"]`).attr("id");
    if ($(`#${windowID}`).hasClass("wolf")) return;
    const height = $(window).height() - 22;
    const s = $(`.window[pid="${pid}"]`).find(".maximize").attr("state");
    if (s === "min") {
      this.beforeWindow(pid, () => {
        if (!$(`.window[pid="${pid}"]`).is(":animated")) {
          $(`.window[pid="${pid}"]`).animate({
            opacity: 1,
            top: 0,
            left: 0,
            height: `${height}px`,
            width: $(window).width(),
          });
          $(`.window[pid="${pid}"]`).find(".maximize").attr("state", "max");
          if ($(`#${windowID}`).hasClass("word")) {
            const docHeight =
              height -
              ($(`#${windowID} .toolbar`).outerHeight() * 3 +
                60 +
                $(`#${windowID} .status-bar`).outerHeight() +
                $(".title").outerHeight());
            $(`#${windowID} .document-content`).animate({
              height: `${docHeight}px`,
            });
          } else if ($(`#${windowID}`).hasClass("mail")) {
            const docHeight = height - 246;
            $(`#${windowID} .mail-content`).animate({
              height: `${docHeight}px`,
            });
          } else if ($(`#${windowID}`).hasClass("notepad")) {
            const docHeight = height - 74;
            $(`#${windowID} .document-content`).animate({
              height: `${docHeight}px`,
            });
          } else if ($(`#${windowID}`).hasClass("explorer")) {
            const docHeight = height - 152;
            $(`#${windowID} #explorer-content`).animate({
              height: `${docHeight}px`,
            });
          }
          $(`.window[pid="${pid}"]`)
            .find(".maximize")
            .css("background-image", "url(../images/window/max.png)");
          $(`.window[pid="${pid}"]`).draggable("disable").resizable("disable");
        }
      });
    } else if (s === "max") {
      const windowData = $(`.window[pid="${pid}"]`).data();
      if (!$(`.window[pid="${pid}"]`).is(":animated")) {
        $(`.window[pid="${pid}"]`).animate({
          opacity: 1,
          top: windowData.originalTop,
          left: windowData.originalLeft,
          width: `${windowData.originalWidth}px`,
          height: `${windowData.originalHeight}px`,
        });
        if ($(`#${windowID}`).hasClass("word")) {
          const docHeight = windowData.originalContentHeight;
          $(`#${windowID} .document-content`).animate({
            height: `${docHeight}px`,
          });
        } else if ($(`#${windowID}`).hasClass("mail")) {
          const docHeight = windowData.originalContentHeight;
          $(`#${windowID} .mail-content`).animate({
            height: `${docHeight}px`,
          });
        } else if ($(`#${windowID}`).hasClass("notepad")) {
          const docHeight = windowData.originalContentHeight;
          $(`#${windowID} .document-content`).animate({
            height: `${docHeight}px`,
          });
        } else if ($(`#${windowID}`).hasClass("explorer")) {
          const docHeight = windowData.originalContentHeight;
          $(`#${windowID} #explorer-content`).animate({
            height: `${docHeight}px`,
          });
        }

        $(`.window[pid="${pid}"]`).find(".maximize").attr("state", "min");
        $(`.window[pid="${pid}"]`)
          .find(".maximize")
          .css("background-image", "url(../images/clippy/window/maximize.png)");
        $(`.window[pid="${pid}"]`).draggable("enable").resizable("enable");
      }
    }
  }
  minimize(pid) {
    let windowID = $(`.window[pid="${pid}"]`).attr("id");
    windowID = `#${windowID}`;
    //var pid = $(windowID).attr('pid');
    const state = $(`.window[pid="${pid}"]`).find(".maximize").attr("state");
    if (state === "max") {
      this.programMinimize(pid);
    } else if (state === "min") {
      this.beforeWindow(pid, () => {
        this.programMinimize(pid);
      });
    }
  }
  //top: 54.3px; left: 634.333px; height: 305.58px; width: 939.5px; z-index: 102; display: block;
  beforeWindow(pid, callback) {
    $(`.window[pid="${pid}"]`)
      .promise()
      .done(() => {
        const $windowID = $(`.window[pid="${pid}"]`);
        const originalOffset = $windowID.offset();
        const originalTop = originalOffset.top;
        const originalLeft = originalOffset.left;
        const originalPosition = $windowID.css("position");
        const originalHeight = $windowID.outerHeight();
        const originalWidth = $windowID.outerWidth();
        const originalDisplay = $windowID.css("display");
        const originalOpacity = $windowID.css("opacity");
        let originalContentHeight = 0;
        if ($(`.window[pid="${pid}"]`).hasClass("word")) {
          originalContentHeight = $windowID
            .find(".document-content")
            .outerHeight();
        } else if ($(`.window[pid="${pid}"]`).hasClass("mail")) {
          originalContentHeight = $windowID.find(".mail-content").height();
        } else if ($(`.window[pid="${pid}"]`).hasClass("notepad")) {
          originalContentHeight = $windowID
            .find(".document-wrap")
            .outerHeight();
        } else if ($(`.window[pid="${pid}"]`).hasClass("explorer")) {
          originalContentHeight = $windowID
            .find("#explorer-content")
            .outerHeight();
        }

        $windowID.data({
          originalTop: originalTop,
          originalLeft: originalLeft,
          originalDisplay: originalDisplay,
          originalPosition: originalPosition,
          originalHeight: originalHeight,
          originalWidth: originalWidth,
          originalOpacity: originalOpacity,
          originalContentHeight: originalContentHeight,
        });
        callback();
      });
  }

  programClose(pid, close) {
    if (close === true) {
      this.removeWindow(pid);
      super.removeProcess(pid);
      this.removeTask(pid);
    }
  }
  programMinimize(pid) {
    this.minimizeWindow(pid);
    this.minimizeTask(pid);
  }
  /**
   * @param {pid} - Set Active Everywhere.
   * Window Show front
   * Task Set Active
   * set process active in process list.
   *
   */
  setInActive(pid) {
    this.setTaskInActive(pid);
    super.setProcessInActive(pid);
    this.minimize(pid);
  }
  setActive(pid) {
    this.setTaskActive(pid);
    super.setProcessActive(pid);
    this.setWindowActive(pid);
  }
  //----------------------------------------------- MAIN WINDOW FUNCTIONS -----------------------------------------//
  /**
   * Set Window Inital positions.
   * @return {nothing}
   */
  windowInitalPositionValues() {
    this.h = $(window).height();
    this.w = $(window).width();
    this.topInit = this.h / 12;
    this.leftInit = this.w / 6;
    this.topVal = this.h / 10;
    this.leftVal = this.w / 3;
    this.totalheight = this.h / 4;
    this.totalwidth = this.w / 2;
    this.offsetpx = 32;
    this.top1;
    this.left1;
    this.taskWidth = 219;
    this.iconNumber = 20;
    this.iconTop = 0;
    this.iconLeft = 0;
    if (isFirstLogin()) {
      this.botSave = false;
      this.botOpen = false;
      this.botWord = false;
    } else {
      this.botSave = true;
      this.botOpen = true;
      this.botWord = true;
    }
  }
  /**
   * Calculates and Sets the position of the window.
   * @param {windowID}
   * @return nothing
   */
  setWindowPosition(windowId) {
    const pid = $(windowId);
    console.log(pid);
    if ($(windowId).hasClass("winamp")) return;
    const offset = pid.offset();
    this.top1 = offset.top + this.topVal;
    this.topVal = this.topVal + this.offsetpx;
    this.left1 = offset.left + this.leftVal;
    this.leftVal = this.leftVal + this.offsetpx;
    pid.offset({
      top: this.top1,
      left: this.left1,
    });
    $(windowId).height(this.h * 0.6);
    //	$(windowId).width(this.w * 0.60);
    $(`${windowId} .document-content`).height(this.h * 0.6);
    //$(windowId + ' .document-content').width(this.w * 0.50);
    $(`${windowId} .mail-content`).height(this.h * 0.6 - 246);
    if (this.topVal > this.totalheight) {
      this.topVal = this.topInit;
      this.leftVal = this.leftVal + 32;
    }
    if (this.leftVal > this.totalwidth) {
      this.topVal = this.topVal + 32;
      this.leftVal = this.leftInit;
    }
  }

  setWindowActive(pid) {
    let windowData;
    const $pid = $(`.window[pid="${pid}"]`);
    const state = $pid.find(".maximize").attr("state");
    if (!$(`.window[pid="${pid}"]`).is(":animated")) {
      if ($pid.css("opacity") === "0") {
        if (state === "max") {
          const height = $(window).height() - $("#taskbar").outerHeight();
          this.ani1 = $(`.window[pid="${pid}"]`).animate({
            opacity: 1,
            top: 0,
            left: 0,
            height: `${height}px`,
            width: $(window).width(),
          });
          if ($(`.window[pid="${pid}"]`).hasClass("word")) {
            const docHeight =
              height -
              ($(`.window[pid="${pid}"] .toolbar`).outerHeight() * 3 +
                48 +
                $(`.window[pid="${pid}"] .status-bar`).outerHeight() +
                $(".title").outerHeight());
            $(`.window[pid="${pid}"] .document-content`).animate({
              height: docHeight,
            });
          } else if ($(`.window[pid="${pid}"]`).hasClass("mail")) {
            const docHeight = height - 246;
            $(`.window[pid="${pid}"] .mail-content`).animate({
              height: docHeight,
            });
          } else if ($(`.window[pid="${pid}"]`).hasClass("explorer")) {
            const docHeight = height - 350;
            $(`.window[pid="${pid}"] .explorer-content`).animate({
              height: docHeight,
            });
          }
        } else if (state === "min") {
          //console.log('min');
          windowData = $pid.data();
          $pid.animate({
            opacity: 1,
            top: windowData.originalTop,
            left: windowData.originalLeft,
            width: `${windowData.originalWidth}px`,
            height: `${windowData.originalHeight}px`,
          });
          if ($(`.window[pid="${pid}"]`).hasClass("word")) {
            const docHeight = windowData.originalContentHeight;
            $(`.window[pid="${pid}"] .document-content`).animate({
              height: docHeight,
            });
          } else if ($(`.window[pid="${pid}"]`).hasClass("mail")) {
            const docHeight = windowData.originalContentHeight;
            $(`.window[pid="${pid}"] .mail-content`).animate({
              height: docHeight,
            });
          }
        }
      }
    }
    zIndex++;
    $pid.css({
      zIndex: zIndex,
    });
    $pid.css("display", "block");
    $(".window").removeClass("active-window");
    if ($pid.hasClass("winamp")) return;
    $pid.addClass("active-window");
  }
  setWindowInActive() {
    $(".window").removeClass("active-window");
  }
  removeWindow(pid) {
    $(`.window[pid="${pid}"]`).animate({
      opacity: 0,
      top: $(window).height(), // to force the window to minimize at the bottom corner
      // top: 0,
      left: 0,
      width: "0px",
      height: 0,
    });
    // if ($('.window[pid="' + pid + '"]').hasClass('winamp')) {
    //     $('script[src*="winamp2-js/built/winamp.js"]').remove();
    // }
    $(`.window[pid="${pid}"]`)
      .promise()
      .done(() => {
        $(`.window[pid="${pid}"]`).remove();
      });
  }
  minimizeWindow(pid) {
    if (!$(`.window[pid="${pid}"]`).is(":animated")) {
      $(`.window[pid="${pid}"]`).animate({
        opacity: 0,
        top: $(window).height(), // to force the window to minimize at the bottom corner
        // top: 0,
        left: 0,
        width: "0px",
        height: 0,
      });
      $(`.window[pid="${pid}"]`)
        .promise()
        .done(() => {
          $(`.window[pid="${pid}"]`).css({
            display: "none",
          });
        });
    }
  }
  // ---------------------------------------------- Shutdown Functions --------------------------------------------------------//
  shutdown() {
    const self = this;
    $("#menu").css("display", "none");
    $("#desktop").css("pointer-events", "none");
    $("#shutdown").css("display", "block");
    SystemUI.insertOverlay("shutdown", true);
    $("#shutdown")
      .off()
      .on("click", ".close", () => {
        SystemUI.removeOverlay();
        $("#shutdown").css("display", "none");
        $("#desktop").css("pointer-events", "auto");
      });
    $("#shutdown button")
      .off()
      .on("click", function () {
        if ($(this).val() === "ok") {
          switch ($("input[name=shut]:checked").val()) {
            case "shutdown":
              self.beforeFinalShutdown("shutdown");
              return;
            case "restart":
              self.beforeFinalShutdown("restart");
              return;
            case "stand-by":
              self.enterStandby();
              return;
            default:
              SystemUI.setDialogBox(
                "shutdown",
                "Programs",
                "1",
                "No Option Selected.",
              );
          }
        } else {
          $("#shutdown #dialog").remove();
          $("#shutdown").css("display", "none");
          SystemUI.removeOverlay();
          $("#desktop").css("pointer-events", "auto");
        }
      });
  }
  beforeSystemClose(parentID, callback) {
    let saved = true;
    $(".window").each(function () {
      if ($(this).attr("saved") === "false") {
        saved = false;
      }
    });
    if (!saved) {
      SystemUI.setDialogBox(
        parentID,
        "Programs",
        "4",
        "Are you sure you want to close all windows before exiting?",
      );
      $(`#${parentID} #dialog button`)
        .off()
        .on("click", function () {
          //console.log('inDialog');
          $(`#${parentID}`).css("pointer-events", "auto");
          $(`#${parentID}`).css("zIndex", "2147483646");
          const d = $(this).attr("value");
          if (d === "yes") {
            callback(true);
          } else {
            $(`#${parentID} #dialog`).remove();
            callback(false);
          }
        });
    } else {
      callback(true);
    }
  }
  beforeFinalShutdown(shut) {
    this.beforeSystemClose("shutdown", (e) => {
      if (e) {
        if (shut === "shutdown") {
          this.finalShutdown();
        } else if (shut === "restart") {
          this.restart();
        } else if (shut === "logoff") {
          this.logoff();
        }
      } else {
        $("#shutdown").css("display", "none");
        $("#desktop").css("pointer-events", "auto");
        SystemUI.removeOverlay();
      }
    });
    // var parentSel = $('#shutdown');
    // var saved = true;
    // $('.window').each(function(){
    // 	if ($(this).attr('saved') === "false"){
    // 			saved = false;
    // 	}
    //    });
    //    if(!saved){
    //    	console.log('beforeFinalShutdown' + 'saved' + saved);
    //    	SystemUI.setDialogBox('#shutdown', 'Programs', '4', 'Are you sure you want to close all windows before exiting?');
    // 		$(parentSel + " #dialog button").on('click', function() {
    // 		//console.log('inDialog');
    // 		$(parentSel).css('pointer-events', 'auto');
    // 		$(parentSel).css('zIndex','2147483646');
    // 		var d = $(this).attr('value');
    // 		if (d === "yes") {
    // 			if(shut==='shutdown'){
    // 			self.finalShutdown();}
    // 			else if(shut==="restart"){
    // 			self.restart();
    // 			}
    // 			else if(shut==="logoff"){
    // 			self.logoff();
    // 			}
    // 		}
    // 		else if(d==="no" || d==="cancel"){
    // 			$('#shutdown').css('display','none');
    // 			$('#desktop').css('pointer-events','auto');
    // 			self.removeOverlay();
    // 		}
    // 	});
    //    }
    //    else{
    //    	console.log('Saved');
    //    	if(shut==="shutdown"){
    //    	self.finalShutdown();
    //    	}
    //    	else if(shut==="restart"){
    //    		self.restart();
    //    	}
    //    }
  }
  finalShutdown() {
    $("body").html("");
    $("body").css("background", "url(../images/shutdown.jpg) no-repeat center");
    sound.play("sprite3");
    setTimeout(() => {
      $("body")
        .css("background", "none")
        .html(
          '<h1 style="text-align:center; margin:0 auto;">If you want to see more cool stuff.<br> Go to <a href = "https://github.com/lolstring/">https://github.com/lolstring/</a>.<br> You can contact me on <a href=rahulmehra@techgeek.co.in>rahulmehra@techgeek.co.in</a>.<br> <br><br> <a href="https://rahul.io">Power On</a></h1>',
        );
    }, 4000);
  }
  restart() {
    $("body").html("");
    $("body").css("background", "url(../images/shutdown.jpg) no-repeat center");
    sound.play("sprite3");
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
  static insertOverlay(id, background) {
    let overlayData = "";
    if (background) {
      overlayData = `<div id="overlay" width="100%" height="100%" style="background:url(images/word%20images/background123.png);"></div>`;
    } else {
      overlayData = `<div id="overlay" width="100%" height="100%""></div>`;
    }
    $('body').append(overlayData);

    const z = 2147483644;
    $('#overlay').css('zIndex', z - 1);
    $(`#${id}`).css('zIndex', z);
    $('#overlay').on('click', (e) => {
      e.stopPropagation();
      sound.play('sprite2');
    });
  }
  static removeOverlay() {
    $("#overlay").each(function () {
      $(this).remove();
    });
  }
  enterStandby() {
    const standByData = `<div id="standby" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>`;
    $(standByData).appendTo("body");
    $("#shutdown").css("display", "none");
    $("#desktop").css("pointer-events", "none");
    SystemUI.setDialogBox("standby", "Stand By", "1", "Click ok to stand by");
    $("#standby").css("zIndex", 2147483646);
    $("#standby button")
      .off()
      .on("click", () => {
        this.exitStandBy();
      });
  }
  exitStandBy() {
    SystemUI.removeOverlay();
    $("#standby").remove();
    $("#desktop").css("pointer-events", "auto");
  }

  // ----------------------------------- Destroy Session ---------------------------//

  destroySession() {
    localStorage.clear();
  }
  //------------------------------------Log off---------------------------------------------------//

  beforeLogoff(destroySession) {
    const self = this;
    const parentSel = "#logoff";
    if (destroySession) {
      $("#logoff p").text(
        "Are you sure you want to destroy session and logoff?",
      );
    }
    $("#logoff").css("display", "block");
    $("#desktop").css("pointer-events", "none");
    SystemUI.insertOverlay("logoff", true);
    $("#logoff")
      .off()
      .on("click", ".close", () => {
        SystemUI.removeOverlay();
        $("#logoff").css("display", "none");
        $("#desktop").css("pointer-events", "auto");
      });
    $(`${parentSel} button`).on("click", function () {
      //console.log('inDialog');
      $(parentSel).css("pointer-events", "auto");
      $(parentSel).css("zIndex", "2147483646");
      const d = $(this).attr("value");
      if (d === "yes") {
        self.beforeSystemClose("logoff #dialog", (e) => {
          if (e) {
            if (destroySession) {
              self.destroySession();
            }
            self.logoff();
            SystemUI.removeOverlay();
          } else {
            $("#logoff").css("display", "none");
            SystemUI.removeOverlay();
            $("#desktop").css("pointer-events", "auto");
          }
        });
      } else {
        SystemUI.removeOverlay();
        $("#logoff").css("display", "none");
        $("#desktop").css("pointer-events", "auto");
      }
      $("#logoff p").text("Are you sure you want to logoff?");
    });
  }
  logoff() {
    sound.play("sprite3");
    setTimeout(() => {
      location.reload();
    }, 4000);

    // var src="scripts/es2015.js";
    // $('script[src="' + src + '"]').remove();
    //      	$('<script>').attr('src', src).appendTo('head');
    // $('#desktop').css('display','none');
    // $('#desktop-icons .user-file').remove();
    // $('#desktop .window').remove();
    // $('.window-open').remove();
    // $('#login').css('display','block');
  }
  //---------------------------------------------RUN _--------------------------------//
  runInit() {
    $.widget("ui.combobox", {
      sendCmd: () => {
        //$(this.element).trigger('change');
      },
      _create: function () {
        this.wrapper = $("<span>")
          .addClass("custom-combobox")
          .insertAfter(this.element);

        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
      },

      _createAutocomplete: function () {
        const selected = this.element.children(":selected");
        const value = selected.val() ? selected.text() : "";

        this.input = $("<input>")
          .appendTo(this.wrapper)
          .val(value)
          .attr("tabindex", "0")
          .addClass(
            "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left",
          )
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy(this, "_source"),
          })
          .tooltip({
            tooltipClass: "ui-state-highlight",
          });

        this._on(this.input, {
          autocompleteselect: function (event, ui) {
            ui.item.option.selected = true;
            this._trigger("change", event, {
              item: ui.item.option,
            });

            this.sendCmd(ui.item.value);
          },

          autocompletechange: "_removeIfInvalid",
        });
      },

      _createShowAllButton: function () {
        const input = this.input;
        let wasOpen = false;

        $("<a>")
          .attr("tabIndex", -1)
          .appendTo(this.wrapper)
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s",
            },
            text: false,
          })
          .removeClass("ui-corner-all")
          .addClass("custom-combobox-toggle ui-corner-right")
          .mousedown(() => {
            wasOpen = input.autocomplete("widget").is(":visible");
          })
          .click(() => {
            //input.focus();

            // Close if already visible
            if (wasOpen) {
              return;
            }

            // Pass empty string as value to search for, displaying all results
            input.autocomplete("search", "");
          });
      },

      _source: function (request, response) {
        const matcher = new RegExp(
          $.ui.autocomplete.escapeRegex(request.term),
          "i",
        );
        response(
          this.element.children("option").map(function () {
            const text = $(this).text();
            if (this.value && (!request.term || matcher.test(text)))
              return {
                label: text,
                value: text,
                option: this,
              };
          }),
        );
      },

      _removeIfInvalid: function (_event, ui) {
        // Selected an item, nothing to do
        if (ui.item) {
          return;
        }

        // Search for a match (case-insensitive)
        const value = this.input.val();
        const valueLowerCase = value.toLowerCase();
        let valid = false;
        this.element.children("option").each(function () {
          if ($(this).text().toLowerCase() === valueLowerCase) {
            this.selected = valid = true;
            return false;
          }
        });

        // Found a match, nothing to do
        if (valid) {
          return;
        }

        // Remove invalid value
        this.element.append(
          $("<option>", {
            value: this.input.val(),
            text: this.input.val(),
          }),
        );
        this.input.autocomplete("instance").term = "";
      },

      _destroy: function () {
        this.wrapper.remove();
        this.element.show();
      },
    });
    $("#combobox").combobox();
    //End Data*/f
  }
  runProgram(value) {
    const v1 = value.toLowerCase();
    const pid = $("#run").attr("pid");
    if (~v1.indexOf("word")) {
      this.newWord();
    } else if (~v1.indexOf("notepad")) {
      this.newNotepad();
    } else if (~v1.indexOf("winamp")) {
      this.newWinamp();
    } else if (~v1.indexOf("mail")) {
      this.newMail();
    } else if (~v1.indexOf("minesweeper")) {
      $('.desktop-icon[program-name="minesweeper"]').trigger("dblclick");
    } else if (~v1.indexOf("wolf")) {
      this.newWolf();
    } else if (~v1.indexOf("help")) {
      console.log(this.runProgram.toString());
    } else if (~v1.indexOf(".doc")) {
      const newValue = value.replace(".doc", "");
      const a = this.checkIfFileExists(newValue, "doc");
      if (a) {
        this.newWord(a);
      } else {
        SystemUI.setDialogBox(
          "run",
          "Error",
          "1",
          "Please check your file name. Click OK to continue.",
        );
        return;
      }
    } else if (~v1.indexOf(".pdf")) {
      const newValue = value.replace(".pdf", "");
      const a = this.checkIfFileExists(newValue, "pdf");
      if (a) {
        this.newWord(a);
      } else {
        SystemUI.setDialogBox(
          "run",
          "Error",
          "1",
          "Please check your file name. Click OK to continue.",
        );
        return;
      }
    } else if (~v1.indexOf(".txt")) {
      const newValue = value.replace(".txt", "");
      const a = this.checkIfFileExists(newValue, "txt");
      if (a) {
        this.newNotepad(a);
      } else {
        SystemUI.setDialogBox(
          "run",
          "Error",
          "1",
          "Please check your file name. Click OK to continue.",
        );
        return;
      }
    } else {
      SystemUI.setDialogBox(
        "run",
        value,
        "1",
        `Cannot find the file ${value}. Make sure the path and filename are correct and that all required libraries are available.<br> Commands Supported:<br>&nbsp;&#149;Installed Executable<br>&nbsp;&#149;Filename with Extension<br>&nbsp;`,
      );
      return;
    }
    this.beforeWindow(pid, () => {
      this.programMinimize(pid);
    });
  }
  //----------------------------------------------- SAVE/OPEN/ATTACH WINDOW FUNCTIONS -----------------------------------------//
  showOpen(parentId) {
    //e.preventDefault();
    const openSel = `#${parentId} #open`;
    $(openSel).css("display", "block");
    // .draggable({
    // 	handle: '.title-bar'
    // });
    this.updateContentBox(openSel);
    const offset = $(openSel).offset();
    $(openSel).css({
      top: offset.top,
      left: offset.left,
      position: "fixed",
    });
    $(`#${parentId}`)
      .closest("[id]")
      .css("pointer-events", "none");
    $(openSel).css("pointer-events", "auto");
    if (this.botOpen === false) {
      globalBot.agent((a) => {
        a.moveTo(offset.left + 150, offset.top + 150);
        a.speak("You can open a file from this desktop.");
      });
      this.botOpen = true;
    }
  }
  showSave(parentId) {
    const saveSel = `#${parentId} #save`;
    $(saveSel).css("display", "block");
    // .draggable({
    // 	handle: '.title-bar'
    // });
    this.updateContentBox(saveSel);
    const offset = $(saveSel).offset();
    $(saveSel).css({
      top: offset.top,
      left: offset.left,
      position: "fixed",
    });
    $(`#${parentId}`)
      .closest("[id]")
      .css("pointer-events", "none");
    $(saveSel).css("pointer-events", "auto");

    if (this.botSave === false) {
      globalBot.agent((a) => {
        a.moveTo(offset.left + 150, offset.top + 150);
        a.speak(
          "You can save to desktop which is internally stored to Local Storage so be careful when you clear cache or you can download it to your own computer.",
        );
      });
      this.botSave = true;
    }
  }

  updateContentBox(e) {
    const content = $(`${e} .content1-box`);
    //var childOffset1 ={top,left};
    $(`${e} .user-file-list`).remove();
    const b = this.getFromLocal();
    let extension;
    let img;
    let type;
    let filename;

    $.each(b, (_i, e) => {
      //var a = memphis.getDesktopPos();
      type = e.type;
      filename = e.filename;
      if (type === "doc" || type === "word") {
        extension = "doc";
        img = "images/win98_icons/WINWORD_2.ico";
      } else if (type === "pdf") {
        extension = type;
        img = "images/win98_icons/pdf.png";
      } else if (type === "txt") {
        extension = type;
        img = "images/win98_icons/notepad_file.ico";
      }
      //var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
      const iconData =
        `<div class="folder-list user-file-list" fileID="${e.fileID}" type="${extension}" tabindex="0"><img class="icon" src="${img}" style="width:14px;"/><span style="vertical-align:top">${filename}</span></div>`;
      $(iconData).appendTo(content);
    });
  }
  print(_content) {
    // $.cachedScript("vendor/jspdf.min.js").done(function(script, textStatus) {
    //     var printDoc = new jsPDF();
    //     printDoc.fromHTML(content, 10, 10, {
    //         'width': 180
    //     });
    //     printDoc.autoPrint();
    //     printDoc.output("dataurlnewwindow");
    // });
    return xepOnline.Formatter.Format(`${parentId}-content .document-wrap`, {
      render: "newwin",
      filename: "print",
      //attach:parentId,
      //fileID:'file-1473946043124'
    });
  }
  printFile(parentId) {
    return xepOnline.Formatter.Format(`${parentId}-content .document-wrap`, {
      render: "newwin",
      filename: "print",
      //attach:parentId,
      //fileID:'file-1473946043124'
    });
  }
  open(windowId) {
    const self = this;
    const parentId = $(windowId)
      .closest("[id]")
      .parent()
      .closest("[id]")
      .attr("id");
    const parentSel = `#${parentId}`;
    const fileID = $(`${parentSel} #open .fileID`).val();
    //var type = $(parentSel + ' #open select#file-type').val();
    //var location = $(parentSel + ' #open select#open-location').val();
    //console.log(parentId + ' ' + location);
    const filename = $(`${parentSel} #open input.filename`).val();
    //console.log("open FUNCTION-filename:" + filename);
    if (filename === "") {
      SystemUI.setDialogBox(
        parentId,
        "Error",
        "1",
        "Please enter a file name. Click OK to continue.",
      );
      $(`${parentSel} #open`).css("pointer-events", "none");
      $("#dialog button").on("click", () => {
        $(`${parentSel} #open`).css("pointer-events", "auto");
      });
    } else {
      const saved = $(parentSel).attr("saved");
      if (saved === "false") {
        $(`${parentSel} #dialog button`).on("click", function () {
          //console.log('inDialog');
          $(parentSel).css("pointer-events", "auto");
          const d = $(this).attr("value");

          if (d === "yes") {
            const a = self.getFileFromLocal(fileID);
            $(parentSel)
              .children()
              .children()
              .children(".title")
              .text(a.filename);
            $(`#task-${parentId} p`).text(filename);
            $(parentSel).find(".document-wrap").html(a.content);
            $(parentSel).attr("fileid", fileID);
            MsWord._wordNumberRemove($(parentSel).attr("docNumber"));
            $(`${parentSel} #open`).css("display", "none");
            $(parentSel).css("pointer-events", "auto");
            $(parentSel).attr("saved", "true");
          } else if (d === "no") {
            $(`${parentSel} #dialog`).css("display", "none");
            $(`${parentSel} #open`).css("display", "block");
          } else if (d === "cancel") {
            $(`${parentSel} #dialog`).css("display", "none");
            $(`${parentSel} #open`).css("display", "block");
          }
        });
      } else {
        const a = this.getFileFromLocal(fileID);
        $(parentSel).children().children().children(".title").text(a.filename);
        $(`#task-${parentId} p`).text(filename);
        $(parentSel).find(".document-wrap").html(a.content);
        $(parentSel).attr("fileid", fileID);
        MsWord._wordNumberRemove($(parentSel).attr("docNumber"));
        $(`${parentSel} #open`).css("display", "none");
        $(parentSel).css("pointer-events", "auto");
        $(parentSel).attr("saved", "true");
      }
    }
  }
  save(windowId) {
    const parentId = $(windowId)
      .closest("[id]")
      .parent()
      .closest("[id]")
      .attr("id");
    const parentSel = `#${parentId}`;
    const type = $(`${parentSel} #save select#file-type`).val();
    const location = $(`${parentSel} #save select#save-location`).val();
    const filename = $(`${parentSel} #save input.filename`).val();
    if (filename === "") {
      SystemUI.setDialogBox(
        parentId,
        "Error",
        "1",
        "Please enter a file name. Click OK to continue.",
      );
      $(`${parentSel} #save`).css("pointer-events", "none");
      $("#dialog button").on("click", () => {
        $(`${parentSel} #save`).css("pointer-events", "auto");
      });
    } else {
      if (location === "desktop") {
        const contentDocument = $(`${parentSel}-content .document-wrap`).html();
        this.saveToLocal(parentId, filename, contentDocument, type);
        const c = `${filename} - Microsoft Word`;
        $(parentSel).children().children().children(".title").text(c);
        $(`#task-${parentId} p`).text(filename);
        $(`${parentSel} #save`).css("display", "none");
        $(parentSel).css("pointer-events", "auto");
      } else if (location === "computer") {
        this.saveFile(parentId, filename, type);
        $(`${parentSel} #save`).css("display", "none");
      } else if (location === null) {
        SystemUI.setDialogBox(
          parentId,
          "Error",
          "1",
          "Please Choose a location.",
        );
        //$(parentSel + ' #save').css('pointer-events', 'none');
      }
      $("#dialog button").on("click", () => {
        $(parentSel).css("pointer-events", "auto");
      });
    }
  }
  getFromLocal() {
    const a = [];
    let localData = [];
    const result = $.grep(
      JSON.parse(localStorage.getItem("users")).users,
      (e) =>
        e.username === JSON.parse(localStorage.getItem("currentUser")).username,
    );
    if (result.length === 1) {
      localData = result[0];
    }
    //var localData = JSON.parse(localStorage.getItem("user")).find(function(e){return e.username = JSON.parse(localStroage.getItem('currentUser')).username});

    if (
      localData != null &&
      typeof localData !== "undefined" &&
      localData.files.length > 0
    ) {
      $.each(localData.files, (_i, e) => {
        const b = {
          fileID: e.fileID,
          program: e.program,
          filename: e.filename,
          type: e.type,
        };
        //if(typeof a != "undefined" && a != null && a.length > 0){
        a.pushIfNotExist(
          b,
          (k) =>
            k.fileID === b.fileID &&
            k.filename === b.filename &&
            k.type === b.type,
        );
        //	}
        //	else{//this doesn't execute
        //		console.log("nothere");
        //		a.push({filename:e.filename,type:e.type});
        //	}
      });
      return a;
    }
    console.log("No Files");
  }
  getFileFromLocal(fileID) {
    let contentDocument;
    let localData;
    const result = $.grep(
      JSON.parse(localStorage.getItem("users")).users,
      (e) =>
        e.username === JSON.parse(localStorage.getItem("currentUser")).username,
    );
    if (result.length === 1) {
      localData = result[0];
    }
    for (let i = 0; i < localData.files.length; i++) {
      if (fileID === localData.files[i].fileID) {
        contentDocument = localData.files[i];
        break;
      }
    }
    return contentDocument;
  }

  saveToLocal(parentId, filename, contentDocument, type) {
    let localData;
    if (typeof Storage !== "undefined") {
      $(`#${parentId}`).attr("saved", true);
      const program = $(`#${parentId}`).attr("program-name");
      const result = $.grep(
        JSON.parse(localStorage.getItem("users")).users,
        (e) =>
          e.username ===
          JSON.parse(localStorage.getItem("currentUser")).username,
      );
      if (result.length === 1) {
        localData = result[0];
      }
      const exists = this.checkIfFileExists(filename, type);
      if (exists) {
        if ($(`#${parentId}`).attr("fileid") !== exists) {
          SystemUI.setDialogBox(
            parentId,
            "Microsoft Word",
            "4",
            `Do you want to replace the existing ${filename}.${type}?`,
          );
          $(`#${parentId} #dialog button`).on("click", function () {
            const d = $(this).attr("value");
            if (d === "yes") {
              for (let i = 0; i < localData.files.length; i++) {
                if (
                  filename === localData.files[i].filename &&
                  type === localData.files[i].type
                ) {
                  $(`#${parentId}`).attr("fileid", localData.files[i].fileID);
                  localData.files[i].content = contentDocument;
                  localData.files[i].modifiedDate = Date.now();
                  break;
                }
              }
              const users = JSON.parse(localStorage.getItem("users"));
              $.each(users.users, function () {
                if (
                  this.username ===
                  JSON.parse(localStorage.getItem("currentUser")).username
                ) {
                  this.files = localData.files;
                  return false;
                }
              });
              localStorage.setItem("users", JSON.stringify(users));
              $(`#${parentId} #dialog`).css("display", "none");
            } else if (d === "no") {
              $(`#${parentId} #dialog`).css("display", "none");
              $(`#${parentId} #save`).css("display", "block");
            } else if (d === "cancel") {
              $(`#${parentId} #dialog`).css("display", "none");
            }
          });
        } else {
          for (let i = 0; i < localData.files.length; i++) {
            if (
              filename === localData.files[i].filename &&
              type === localData.files[i].type
            ) {
              $(`#${parentId}`).attr("fileid", localData.files[i].fileID);
              localData.files[i].content = contentDocument;
              localData.files[i].modifiedDate = Date.now();
              break;
            }
          }
          const users = JSON.parse(localStorage.getItem("users"));
          $.each(users.users, function () {
            if (
              this.username ===
              JSON.parse(localStorage.getItem("currentUser")).username
            ) {
              this.files = localData.files;
              return false;
            }
          });
        }
      } else if (!exists) {
        const fid = `file-${Date.now()}`;
        localData.files.push({
          fileID: fid,
          filename: filename,
          content: contentDocument,
          type: type,
          program: program,
          creationDate: Date.now(),
          modifiedDate: Date.now(),
        });
        const users = JSON.parse(localStorage.getItem("users"));
        $.each(users.users, function () {
          if (
            this.username ===
            JSON.parse(localStorage.getItem("currentUser")).username
          ) {
            this.files = localData.files;
            //currentUser = v;
            return false;
          }
        });
        localStorage.setItem("users", JSON.stringify(users));
        $(`#${parentId}`).attr("fileid", fid);
        this.setNewDesktop(fid, program, filename, type);
      }
    } else {
      console.log("Local storage is not supported");
    }
  }

  checkIfFileExists(filename, type) {
    let b;
    let localData;
    const result = $.grep(
      JSON.parse(localStorage.getItem("users")).users,
      (e) =>
        e.username === JSON.parse(localStorage.getItem("currentUser")).username,
    );
    if (result.length === 1) {
      localData = result[0];
    }
    $.each(localData.files, function () {
      if (this.filename === filename && this.type === type) {
        a = true;
        b = this.fileID;
        return false;
      }
      if (this.filename !== filename) {
        b = false;
      }
    });
    return b;
  }
  rename(fileID, filename) {
    const result = $.grep(
      JSON.parse(localStorage.getItem("users")).users,
      (e) =>
        e.username === JSON.parse(localStorage.getItem("currentUser")).username,
    );
    if (result.length === 1) {
      localData = result[0];
    }
    for (let i = 0; i < localData.files.length; i++) {
      if (fileID === localData.files[i].fileID) {
        localData.files[i].filename = filename;
        localData.files[i].modifiedDate = Date.now();
        break;
      }
    }
    const users = JSON.parse(localStorage.getItem("users"));
    $.each(users.users, function () {
      if (
        this.username ===
        JSON.parse(localStorage.getItem("currentUser")).username
      ) {
        this.files = localData.files;
        return false;
      }
    });
    localStorage.setItem("users", JSON.stringify(users));
    const pid = $(`.window[fileid="${fileID}"]`).attr("pid");
    $(`.window[fileid="${fileID}"]`)
      .find(".title")
      .text(filename);
    $(`#taskbar [pid="${pid}"] p`).text(filename);
  }
  saveFile(parentId, filename, type) {
    //console.log(type);
    /*
    var parentId = $(windowId).closest('[id]').parent().closest('[id]').attr('id');
    var type = $('#' + parentId + ' select.select').val();
    console.log(parentId);
    var filename = $('#' + parentId + ' input.filename').val();
    if (filename == "") {
        memphis.setDialogBox(parentId, 'Error', '1', 'Please enter a file name. Click OK to continue.');
    } else {*/
    /*$.ajaxSetup({
         cache: true
    });*/
    if (type === "pdf") {
      $(`#${parentId}`).css("pointer-events", "auto");
      return xepOnline.Formatter.Format(`${parentId}-content .document-wrap`, {
        render: "download",
        filename: filename,
        //attach:parentId,
        //fileID:'file-1473946043124'
      });
    }
    if (type === "word" || type === "doc") {
      this.convertImagesToBase64(parentId);
      $.cachedScript("scripts/vendor.js").done(() => {
        //$.cachedScript("../vendor/html-docx.js").done(function(script, textStatus) {
        const contentDocument = $(`#${parentId}-content`).html();
        const content =
          `<!DOCTYPE html><html><head></head><body>${contentDocument}</body></html>`;
        const orientation = "potrait";
        const converted = htmlDocx.asBlob(content, {
          orientation: orientation,
        });
        saveAs(converted, `${filename}.docx`);
      });
      $(`#${parentId}`).css("pointer-events", "auto");
      return;
    }
    if (type === "txt") {
      const contentTxt = $(`#${parentId}-content`).text().trim();
      const blob = new Blob([contentTxt], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${filename}.txt`);
      $(`#${parentId}`).css("pointer-events", "auto");
      return;
    }
    console.log("error");
    $(`#${parentId}`).css("pointer-events", "auto");
  }
  convertImagesToBase64(parentId) {
    const regularImages = $(`#${parentId}-content img`);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    [].forEach.call(regularImages, (imgElement) => {
      // preparing canvas for drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      ctx.drawImage(imgElement, 0, 0);
      // by default toDataURL() produces png image, but you can also export to jpeg
      // checkout function's documentation for more details
      const dataURL = canvas.toDataURL();
      imgElement.setAttribute("src", dataURL);
    });
    canvas.remove();
  }
  deleteFile(fileID) {
    window.globalBot.agent((a) => {
      a.speak("Are you sure you want to delete this file?");
    });
    let localData;
    if (fileID === "file-0000000000001" || fileID === "file-0000000000002") {
      SystemUI.setDialogBox(
        "desktop",
        "Error",
        "1",
        "You can not delete this file.",
      );
      return;
    }
    const result = $.grep(
      JSON.parse(localStorage.getItem("users")).users,
      (e) =>
        e.username === JSON.parse(localStorage.getItem("currentUser")).username,
    );
    if (result.length === 1) {
      localData = result[0];
    }
    for (let i = 0; i < localData.files.length; i++) {
      if (localData.files[i].fileID === fileID) {
        localData.files.splice(i, 1);
      }
    }
    const users = JSON.parse(localStorage.getItem("users"));
    $.each(users.users, function () {
      if (
        this.username ===
        JSON.parse(localStorage.getItem("currentUser")).username
      ) {
        this.files = localData.files;
        return false;
      }
    });
    localStorage.setItem("users", JSON.stringify(users));
    $(`.desktop-icon[fileid="${fileID}"`).remove();
    $(`.window[fileid="${fileID}"]`).attr("saved", false);
  }
  attach(windowId) {
    const parentId = $(windowId)
      .closest("[id]")
      .parent()
      .closest("[id]")
      .attr("id");
    const parentSel = `#${parentId}`;
    const fileids = $(`${parentSel} #attach .fileID`)
      .val()
      .split("|");
    for (let i = 0; i < fileids.length; i++) {
      this.attachCreate(parentSel, fileids[i]);
    }
  }
  attachCreate(parentID, fileID) {
    this.parentID;
    if (fileID) {
      this.file = this.getFileFromLocal(fileID);
      this.fileBlob = "";
      if (this.file.type === "pdf") {
        this.fileBlob = "pdf";
        this.attachAppend(parentID, this.file, this.fileBlob);
      } else {
        this.fileToBlob(this.file.content, this.file.type, (abc) => {
          this.fileBlob = abc;
          this.attachAppend(parentID, this.file, this.fileBlob);
        });
      }
    } else {
      return;
    }
  }
  attachAppend(parentID, file, fileBlob) {
    if (
      $(`${parentID} div.attachment [file-id="${file.fileID}"]`).length < 1
    ) {
      const iconURL = programData.getIconByType(file.type);
      const attachData = `<div file-id="${file.fileID}" class="attached-list">
		<img class="icon" src="${iconURL}"/>
		<span>${file.filename}</span>
		<div class="cancel" >
		&nbsp;
		</div>
		</div>`;
      $(attachData).appendTo(`${parentID} div.attachment`);
      $(`[file-id="${file.fileID}"]`).data({
        file: fileBlob,
      });
      $(`${parentID} #attach`).css("display", "none");
      $(parentID).css("pointer-events", "auto");
    } else {
      SystemUI.setDialogBox(
        parentID,
        "Attach",
        "1",
        `You have already attached ${file.filename}.${file.type}`,
      );
    }
  }
  fileToBlob(contentDocument, type, callback) {
    this.blob = "";
    this.contentDocument = contentDocument;
    if (type === "word" || type === "doc") {
      $.cachedScript("scripts/vendor.js").done(() => {
        //$.cachedScript("vendor/html-docx.js").done(function(script, textStatus) {
        const content =
          `<!DOCTYPE html><html><head></head><body>${contentDocument}</body></html>`;
        const orientation = "potrait";
        this.blob = htmlDocx.asBlob(content, {
          orientation: orientation,
        });
        callback(this.blob);
      });
    } else if (type === "text" || type === "txt") {
      const contentTxt = contentDocument.trim();
      this.blob = new Blob([contentTxt], {
        type: "text/plain;charset=utf-8",
      });
      callback(this.blob);
    } else {
      this.blob = "blobError";
      callback(this.blob);
    }
  }
  attachPDFData(parentId, fileID, filename) {
    this.filename = filename;
    this.fileID = fileID;
    this.parentId = parentId;
  }
  //----------------------------------------------- TASKBAR FUNCTIONS -----------------------------------------//
  /**
   * Append Task to Taskbar
   * @param  {processID}
   * @param  {program-name}
   * @param  {windowID}
   * @param  {description}
   * @return {nothing.}
   */
  appendTask(processID, program, windowID, description) {
    const newWindowID = windowID.substring(1);
    const taskID = `task-${newWindowID}`;
    const iconURL = programData.getIcon(program);
    const taskbarData = `<span class="window-open" id="${taskID}" pid="${processID}" program-name="${program} "title="${description}">
			<img class="icon" src="${iconURL}"/>
			<p class="text">${description}</p>
		</span>'`;
    $(taskbarData)
      .appendTo("#task")
      .promise()
      .done(() => {
        //log('Create Set Active'); //STILL TO BE MADE//self.setActive(processID);
      });
    this.setTaskPosition();
  }
  /**
   * REDO!!!!!
   * @param {taskID}
   *
   */
  setTaskPosition() {
    const availableWidth = $("#taskbar").outerWidth() - 228;
    const numberOpen = $(".window-open").length;
    const maxWidth = Number.parseInt($(".window-open").css("max-width"), 10);
    let width;
    if (numberOpen > 0) {
      if (numberOpen * maxWidth > availableWidth) {
        width = Math.round(availableWidth / numberOpen) - 10;
      } else {
        width = maxWidth;
      }
    } else {
      width = maxWidth;
    }
    if (width < 31) {
      this.taskSplit();
      width = 30;
    } else {
      this.taskNoSplit();
    }
    $(".window-open").css("width", width);
  }
  taskSplit() {
    const childNodes = $(".window-open");
    const numberFit = Math.round(($("#taskbar").outerWidth() - 228) / 30) - 11;
    const totalChildNodes = childNodes.length;
    const numberOfPages = Math.ceil(totalChildNodes / numberFit);
    const parentElement = $('<span id="task"></span>');
    let temp;
    let i;
    let j = 1;
    let k = 0;
    for (i = 1; i <= numberOfPages; i++) {
      temp =
        `<span id= "task-${i}" class="task-page" style="display:none;" page-num="${i}"></span>`;
      $(parentElement).append(temp);
    }
    for (i = 0; i < totalChildNodes; i++) {
      k++;
      $(parentElement)
        .children(`#task-${j}`)
        .append(childNodes[i]);
      if (k >= numberFit) {
        j++;
        k = 0;
      }
    }
    $("#task").replaceWith(parentElement);
    $(`#task-${j}`)
      .css("display", "inline")
      .addClass("active-page");
    if (numberOfPages > 1) {
      $("#pagination").css("visibility", "visible");
    } else {
      this.showTaskPage(1);
      $("#pagination").css("visibility", "hidden");
    }
  }
  showTaskPage(num) {
    $(".task-page").css("display", "none").removeClass("active-page");
    $(`#task-${num}`)
      .css("display", "inline")
      .addClass("active-page");
  }
  upTaskPage() {
    const numberOfPages = $(".task-page").length;
    let id = Number.parseInt($(".active-page").attr("page-num"));
    id++;
    id < 1 || id > numberOfPages ? "" : this.showTaskPage(id);
  }
  downTaskPage() {
    const numberOfPages = $(".task-page").length;
    let id = Number.parseInt($(".active-page").attr("page-num"));
    id--;
    id < 1 || id > numberOfPages ? "" : this.showTaskPage(id);
  }
  taskNoSplit() {
    const a = 0;
    return a;
  }
  removeTask(pid) {
    $(`#taskbar [pid="${pid}"]`).remove();
    this.setTaskPosition();
  }
  setTaskActive(pid) {
    $("#task span.active-task").removeClass("active-task");
    $(`#task [pid="${pid}"]`).addClass("active-task");
  }
  setTaskInActive(_pid) {
    $("#task span.active-task").removeClass("active-task");
    //$('#task [pid="' + pid + '"]').addClass('active-task');
  }
  minimizeTask(pid) {
    $(`#task [pid="${pid}"]`).removeClass("active-task");
  }

  //------------------------------------------ Dialog Box Functions ---------------------------------------------- //

  static setDialogBox(parentId, title, type, errorMessage) {
    let newParentId;
    if (parentId.indexOf("#") === 0) {
      newParentId = parentId.slice(1, parentId.length);
    } else {
      newParentId = parentId;
    }
    const dialogData =
      `<div id="dialog" class="dialog window active-window ui-widget-content"> <div class="window-border"> <div class="title-bar h-count"> <div class="control-box"> <a class="button-3d close-dialog"><span>&nbsp;</span></a> </div> <span class="title"> ${title} </span> </div> <div class="error-content"> <div class="text"> <img class="icon" src="images/win98_icons/exclamation.ico"/> <p>${errorMessage}</p><br> </div> <div class="button"></div> </div> </div>`;
    $(dialogData).appendTo(`#${newParentId}`);

    $("#dialog .title").text(title);
    if (type === "1" || type === "error") {
      $(`#${newParentId} #dialog img`).attr(
        "src",
        "../images/win98_icons/error.ico",
      );
      $("#dialog .button").append("<button value='ok'>Ok</button>");
    } else if (type === "2" || type === "warning") {
      $("#dialog img").attr("src", "../images/win98_icons/exclamation.ico");
      $("#dialog .button").append("<button value='yes'>Yes</button>");
    } else if (type === "3" || type === "information") {
      $("#dialog img").attr("src", "../images/win98_icons/information.ico");
      $("#dialog .button").append("<button value='yes'>Yes</button>");
    } else if (type === "4" || type === "replace" || type === "leave") {
      $("#dialog img").attr("src", "../images/win98_icons/exclamation.ico");
      $("#dialog .button").html(
        "<button value='yes'>Yes</button><button value='no'>No</button><button value='cancel'>Cancel</button>",
      );
    } else if (type === "5" || type === "logoff") {
      $("#dialog img").attr("src", "../images/win98_icons/key_win.ico");
      $("#dialog .button").html(
        "<button value='yes'>Yes</button><button value='no'>No</button>",
      );
    } else if (type === "6" || type === "delete") {
      $("#dialog img").attr("src", "../images/win98_icons/erase_file.ico");
      $("#dialog .button").html(
        "<button value='yes'>Yes</button><button value='no'>No</button>",
      );
    }
    //$("#dialog p").text(errorMessage);

    /**
     * No pointer events on parent windows when dialog box open.
     */
    $(`#${newParentId} #dialog`).css("display", "block");
    SystemUI.insertOverlay(newParentId, false);
    $(`#${newParentId} #dialog`).css("zIndex", 2147483645);
    $(`#${newParentId} #dialog`).css("position", "fixed");
    //var offset = $("#" + newParentId + " #dialog").offset();
    $(`#${newParentId}`).css("pointer-events", "none");
    $(`#${newParentId} #save`).css("pointer-events", "none");
    $(`#${newParentId} #open`).css("pointer-events", "none");
    $(`#${newParentId} #dialog`).css("pointer-events", "auto");
    $(`#${newParentId} #dialog .title-bar`).css("pointer-events", "none");
    /**
     * Event for Dialog Box
     * @param  {button}
     * @return {[type]}
     */
    $("#dialog button").on("click", () => {
      SystemUI.removeOverlay();
      $(`#${newParentId}`).css("pointer-events", "auto");
      //$(this).closest('[id]').parent().closest('[id]').css('pointer-events', 'auto');
      $(`#${newParentId} #save`).css("pointer-events", "auto");
      $(`#${newParentId} #open`).css("pointer-events", "auto");
      //$(this.closest('[id]')).draggable('enable');
      $(`#${newParentId} #dialog`).remove();
      //$("#" + parentId + " #dialog").css("positon", "relative");
    });
  }

  // ----------------------------------------- Desktop Icon Functions -------------------------------------- //

  // getDesktopPos() {
  //     var left, top, off, num;
  //     $("[id^='desktop-icon'][class^='desktop-icon'][id!='desktop-icon-99']").each(function(i, el) {
  //         off = $(this).offset();
  //         left = off.left;
  //         top = off.top;
  //     });
  //     var wn = $(window).width();
  //     var i = 0,
  //         j = 0;
  //     for (i = 0; i < wn; i = i + 84) {
  //         if (left >= j && left <= i) {
  //             left = j;
  //             break;
  //         }
  //         j = i;
  //     }
  //     if (top > $(window).height() - 196) {
  //         left = left + 84;
  //         top = 0;
  //     } else {
  //         //top=top+64;
  //         var factor = 32;
  //         /*var r=top%74;
  //         if(r==0)
  //         {
  //         	top = top + 74;
  //         }
  //         else{
  //         	top = top - r + 94;
  //         }*/
  //         num = top;
  //         top = num + factor - 1 - (num + factor - 1) % factor;
  //         top = top + 32;
  //     }
  //     var a = {
  //         left1: left,
  //         top1: top
  //     }
  //     return a;
  // }
  getDesktopPos() {
    const $icons = $('.desktop-icon[program-name!="recyclebin"]');
    const iconHeight = 71;
    const iconWidth = 82;
    const containerHeight = $(window).height();
    const numberFit = Math.floor(containerHeight / (iconHeight + 8));
    let otop;
    let oleft;
    let indexY = 0;
    let indexX = 0;
    let a;
    $icons.each(function (i) {
      otop = Number.parseInt($(this).css("top"), 10);
      oleft = Number.parseInt($(this).css("left"), 10);
      console.log(`Top: ${otop}/${iconHeight}=`);
      console.log(`Left: ${oleft}/${iconWidth}=`);
      if (i === 0) return;
      if (otop % iconHeight === 0) {
        indexY = otop / iconHeight + 1;
      } else {
        a = document.elementFromPoint(
          indexX * iconWidth + 8,
          indexY * iconHeight + 8,
        );
        if (a.classList.contains("desktop-icon")) {
          return;
        }
        return false;
      }
      if (oleft % iconWidth === 0) {
        indexX = oleft / iconWidth;
      } else {
        a = document.elementFromPoint(
          indexX * iconWidth + 8,
          indexY * iconHeight + 8,
        );
        if (a.classList.contains("desktop-icon")) {
          return;
        }
        return false;
      }
      if (indexY > numberFit) {
        indexY = 0;
        indexX++;
      }
    });

    a = {
      left1: indexX * iconWidth,
      top1: indexY * iconHeight,
    };
    // var $container = $(this),
    //     $icons = $(options.selector, $container),
    //     containerHeight = $(window).height(),
    //     iconHeight = $($icons[0]).height(),
    //     iconWidth = $($icons[0]).width(),
    //     numberFit = Math.floor(containerHeight / (iconHeight + options.marginTop)),
    //     top = 0,
    //     left = 0;
    //     console.log(top);
    // $icons.each(function(i) {
    //     if (i % numberFit == 0 && i > 0) {
    //         top = 0;
    //         left += iconWidth + options.marginLeft;
    //     }
    //     top = top + options.marginTop;
    //     var a = {
    //         top: top,
    //         left: left + options.marginLeft
    //         };
    //     //console.log($(this).css('top'));
    //     top += iconHeight;
    // });
    return a;
  }
  // getDesktop() {
  //     var filename;
  //     var type;
  //     var img;
  //     var a = [];
  //     $('.desktop-icon').each(function(i, el) {
  //         var filename = $(this).find('span').text();
  //         var img = $(this).css('background-image');
  //         var type = filename.substr(filename.indexOf(".") + 1);
  //         var img = img.replace('url(', '').replace(')', '').replace(/\"/gi, "");
  //         if ($(this).attr('program') == 'recyclbin') {
  //             return;
  //         }
  //         b = {
  //             filename: filename,
  //             img: img,
  //             type: type
  //         };
  //         if (typeof a != "undefined" && a != null && a.length > 0) {
  //             a.pushIfNotExist(b, function(e) {
  //                 return e.filename === b.filename && e.type === b.type
  //             });
  //         } else { //this doesn't execute
  //             a.push({
  //                 filename: filename,
  //                 img: img,
  //                 type: type
  //             });
  //         }
  //     });
  //     return a;
  // }
  // setInitialDesktopPos() {
  //     var $icons = $('.desktop-icon[program-name!="recyclebin"]'),
  //         iconHeight = 70,
  //         iconWidth = 64,
  //         containerHeight = $(window).height(),
  //         containerWidth = $(window).width(),
  //         numberFit = Math.floor(containerHeight / (iconHeight + 8)),
  //         top = 0,
  //         left = 0;
  //     $icons.each(function(i) {
  //         if (i % numberFit == 0 && i > 0) {
  //             top = 0;
  //             left += iconWidth + options.marginLeft;
  //         }
  //         top = top + options.marginTop;
  //         $(this).css({
  //             top: top,
  //             left: left + options.marginLeft
  //         });
  //         top += iconHeight;
  //     });
  // }
  setDesktop() {
    let extension;
    let img;
    let type;
    let filename;
    const b = this.getFromLocal();
    $.each(b, (_i, e) => {
      //a = self.getDesktopPos();
      if (e.fileID === "file-0000000000001") return;
      type = e.type;
      filename = e.filename;
      if (type === "doc" || type === "word") {
        extension = "doc";
        img = "images/win98_icons/WINWORD_2.ico";
      } else if (type === "pdf") {
        extension = type;
        img = "images/win98_icons/pdf.png";
      } else if (type === "txt") {
        extension = type;
        img = "images/win98_icons/notepad_file.ico";
      }
      this.iconNumber++;
      //var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
      //margin-left:-10px;
      //var iconData = '<div draggable="true" id="desktop-icon-' + self.iconNumber + '" class="desktop-icon user-file" data-item="' + self.iconNumber + '" tabindex="0" fileID="' + e.fileID + '" program-name="' + e.program + '" type="' + extension + '" style="background:url(' + img + ') no-repeat center top;background-size: 32px; top:' + a.top1 + 'px; left:' + a.left1 + 'px;"><p class="text" style="text-align:center;"><span>' + filename + '</span></p></div>';
      const iconData =
        `<div draggable="true" id="desktop-icon-${this.iconNumber}" class="desktop-icon user-file" data-item="${this.iconNumber}" tabindex="0" fileID="${e.fileID}" program-name="${e.program}" type="${extension}" style="background:url(${img}) no-repeat center top;background-size: 32px; "><p class="text" style="text-align:center;"><span>${filename}</span></p></div>`;

      $(iconData)
        .appendTo("#desktop-icons")
        .draggable({
          opacity: 0.7,
          delay: 400,
          snap: [71, 82],
          containment: "#desktop",
        });
    });
    setTimeout(() => {
      $("#desktop-icons").setInitialIcons();
    }, 500);
  }
  setNewDesktop(fileID, program, filename, type, shortcut) {
    let extension;
    let img;
    let stclass = "";
    if (shortcut) {
      stclass = "shortcut";
    }
    const a = this.getDesktopPos();
    if (type === "doc" || type === "word") {
      extension = "doc";
      img = "images/win98_icons/WINWORD_2.ico";
    } else if (type === "pdf") {
      extension = type;
      img = "images/win98_icons/pdf.png";
    } else if (type === "txt") {
      extension = type;
      img = "images/win98_icons/notepad_file.ico";
    }
    this.iconNumber++;
    //var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
    const iconData =
      `<div draggable="true" id="desktop-icon-${this.iconNumber}" class="desktop-icon user-file ${stclass} " data-item="${this.iconNumber}" tabindex="0" fileID="${fileID}" program-name="${program}" type="${extension}" style="background:url(${img}) no-repeat center top;background-size: 32px; top:${a.top1}px; left:${a.left1}px;"><p class="text" style="text-align:center; margin-left:-10px;"><span>${filename}</span></p></div>`;
    $(iconData)
      .appendTo("#desktop-icons")
      .draggable({
        opacity: 0.7,
        delay: 400,
        grid: [64, 64],
        containment: "#desktop",
      });
    //memphis.desktopInit();
    //console.log(iconNumber);
  }

  // --- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- MS WORD Functions() -- -- -- -- -- -- -- -- -- -- -- -//

  newWord(fileID) {
    const processID = this.newProcess();
    const p = new MsWord(processID, fileID);
    super.addProcess(processID, "msword", p.windowID, p.description);
    //super.access();
    this.setWindowPosition(p.windowID);
    this.appendTask(processID, "msword", p.windowID, p.description);
    this.setActive(processID);
  }
  // Mail Functions(){
  newMail(fileID) {
    const processID = this.newProcess();
    const p = new MailClient(processID);
    super.addProcess(processID, "mail", p.windowID, p.description);
    this.setWindowPosition(p.windowID);
    this.appendTask(processID, "mail", p.windowID, p.description);
    this.setActive(processID);
    this.attachCreate(p.windowID, fileID);
  }
  sendEmail(windowId) {
    const toEmail = $(`#${windowId} input.sendTo`)
      .val()
      .split(",");
    const ccEmail = $(`#${windowId} input.sendToCC`)
      .val()
      .split(",");
    if (toEmail > 1) {
      SystemUI.setDialogBox(
        windowId,
        "Email address",
        "1",
        "Please enter only 1 email address to send an email to",
      );
    }
    if (ccEmail > 1) {
      SystemUI.setDialogBox(
        windowId,
        "Email address",
        "1",
        "Please enter only 1 email address to send a carbon copy to",
      );
    }
    const subject = $(`#${windowId} input.subject`).val();
    const files = $(`#${windowId} div.attachement`).children();
    for (let i = 0; i < files.length; i++) {
      $(files[i]).data();
      //php is left.
    }
    const body = $(`#${windowId} .mail-content`).text();
    window.open(
      `mailto:${toEmail[0]}?cc=${ccEmail[0]}&subject=${subject}&body=${body}`,
    );
  }
  // -- -- --- -- --- -- --- -- -- -- - Context Menu's -- --- -- -- --- -- -- -- -- - -- //
  contextMenuInit() {
    console.log("Context Menu Init");
    const self = this;
    let file;
    let filename;
    $.contextMenu({
      className: "desktop-context-menu",
      selector: ".user-file",
      callback: function (key) {
        const k = key;
        let that = this;
        switch (key) {
          case "open":
            self.program(this);
            break;
          case "print":
            file = self.getFileFromLocal($(this).attr("fileid"));
            self.print(file.content);
            break;
          case "desktop":
            alert(k);
            break;
          case "mail":
            self.newMail($(this).attr("fileid"));
            break;
          case "delete":
            that = this;
            SystemUI.setDialogBox('desktop', 'Delete File', '6', `Are you sure you want to permenently delete \'${$(this).text()}.${$(this).attr('type')}\'?`);
            $("#desktop" + " #dialog button").on("click", function () {
              const d = $(this).attr("value");
              if (d === "yes") {
                self.deleteFile($(that).attr("fileid"));
              }
            });
            //self.deleteFile($(this).attr('fileid'));
            break;
          case "createShortcut":
            file = self.getFileFromLocal($(this).attr("fileid"));
            self.setNewDesktop(
              file.fileID,
              file.program,
              file.filename,
              file.type,
              true,
            );

            break;
          case "properties":
            self.properties($(this).attr("fileid"));
            break;
          case "rename":
            $(this).children().children().attr("contentEditable", true);
            $(this).children().children().focus();
            that = this;
            $(this)
              .children()
              .children()
              .on("blur", function () {
                $(this).removeAttr("contentEditable");
                $(this).removeAttr("autocomplete");
                filename = $(this).text();
                self.rename($(that).attr("fileid"), filename);
              });
            break;
          default:
            console.log("Shouldnt");
        }
      },
      items: {
        open: {
          name: "Open",
          accesskey: "O",
          className: "context-menu-bold",
        },
        print: {
          name: "Print",
          accesskey: "P",
        },
        sep1: "---------",
        sendTo: {
          name: "Send To",
          accesskey: "T",
          items: {
            desktop: {
              name: "Desktop",
              accesskey: "D",
            },
            mail: {
              name: "Mail Recipient",
              accesskey: "M",
            },
          },
        },
        sep2: "---------",
        cut: {
          name: "Cut",
          accesskey: "t",
          disabled: true,
        },
        copy: {
          name: "Copy",
          accesskey: "c",
          disabled: true,
        },
        sep3: "---------",
        createShortcut: {
          name: "Create Shortcut",
          accesskey: "s",
        },
        delete: {
          name: "Delete",
          accesskey: "d",
        },
        rename: {
          name: "Rename",
          accesskey: "m",
        },
        sep4: "---------",
        properties: {
          name: "Properties",
          accesskey: "r",
        },
      },
    });
    $.contextMenu({
      selector: ".word .menu-bar .file",
      //appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
      trigger: "left",
      position: function (opt) {
        const a = this.offset();
        opt.$menu.css({
          top: a.top + 10,
          left: a.left - 10,
        });
      },
      className: "word-file-context-menu",
      callback: function (key) {
        console.log("here");
        const parentId = $(this).closest("[id]").attr("id");
        switch (key) {
          case "new":
            //e.preventDefault();
            self.newWord();
            break;
          case "open":
            //e.preventDefault();
            self.showOpen(parentId);
            break;
          case "close":
          case "exit":
            $(`#${parentId} a.button-3d.close`).trigger("click");
            break;
          case "print":
            self.printFile(parentId);
            break;
          case "save":
            self.showSave(parentId);
            break;
          case "saveAs":
            self.showSave(parentId);
            break;
          case "mail":
            if (
              $(`#${parentId}`).attr("saved") === "true" &&
              $(`#${parentId}`).attr("fileid") !== "undefined"
            ) {
              self.newMail($(`#${parentId}`).attr("fileid"));
            } else {
              SystemUI.setDialogBox(
                parentId,
                "Error",
                "1",
                "Please save your file before you continue.",
              );
            }
            break;
          default:
            console.log("Shouldnt");
        }
      },
      items: {
        new: {
          name: "New",
          accesskey: "O",
          //className: "context-menu-bold",
          icon: (_opt, $itemElement) => {
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html(
              '<a class="b-new" aria-hidden="true"></a> <p><span class="context-menu-accesskey">N</span>ew</p>',
            );
            // Add the context-menu-icon-updated class to the item
            return "context-menu-icon-updated";
          },
        },
        open: {
          name: "Open",
          accesskey: "O",
          //className: "context-menu-bold",
          icon: (_opt, $itemElement) => {
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html(
              '<a class="b-open" aria-hidden="true"></a> <p><span class="context-menu-accesskey">O</span>pen</p>',
            );
            // Add the context-menu-icon-updated class to the item
            return "context-menu-icon-updated";
          },
        },
        close: {
          name: "Close",
          accesskey: "C",
        },
        sep1: "---------",
        save: {
          name: "Save",
          accesskey: "s",
          //className: "context-menu-bold",
          icon: (_opt, $itemElement) => {
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html(
              '<a class="b-save" aria-hidden="true"></a> <p><span class="context-menu-accesskey">S</span>ave</p>',
            );
            // Add the context-menu-icon-updated class to the item
            return "context-menu-icon-updated";
          },
        },
        saveAs: {
          name: "Save As",
          accesskey: "A",
        },
        saveAsHtml: {
          name: "Save As HTML",
          accesskey: "H",
          disabled: true,
        },
        version: {
          name: "Versions",
          accesskey: "V",
          disabled: true,
        },
        sep2: "---------",
        pageSet: {
          name: "Page Setup",
          accesskey: "u",
          disabled: true,
        },
        printPreview: {
          name: "Print Preview",
          accesskey: "v",

          //className: "context-menu-bold",
          icon: (_opt, $itemElement) => {
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html(
              '<a class="b-preview" aria-hidden="true"></a> <p>Print Pre<span class="context-menu-accesskey">v</span>iew </p>',
            );
            // Add the context-menu-icon-updated class to the item
            return "context-menu-icon-updated";
          },
          disabled: true,
        },
        print: {
          name: "Print",
          accesskey: "P",
          //className: "context-menu-bold",
          icon: (_opt, $itemElement) => {
            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
            $itemElement.html(
              '<a class="b-print" aria-hidden="true"></a> <p><span class="context-menu-accesskey">P</span>rint</p>',
            );
            // Add the context-menu-icon-updated class to the item
            return "context-menu-icon-updated";
          },
        },
        sep3: "---------",
        sendTo: {
          name: "Send To",
          accesskey: "T",
          items: {
            mail: {
              name: "Mail Recipient",
              accesskey: "M",
              icon: (_opt, $itemElement) => {
                // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                $itemElement.html(
                  '<a class="b-mail" aria-hidden="true"></a> <p><span class="context-menu-accesskey">M</span>ail Recipient...</p>',
                );
                // Add the context-menu-icon-updated class to the item
                return "context-menu-icon-updated";
              },
            },
          },
        },
        properties: {
          name: "Properties",
          accesskey: "r",
          disabled: true,
        },
        sep4: "---------",
        exit: {
          name: "Exit",
          accesskey: "e",
        },
      },
    });
    // $.contextMenu({
    //     selector: '.word .menu-bar .edit',
    //     //appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
    //     trigger: 'left',
    //     position: function(opt, x, y) {
    //         var a = this.offset();
    //         opt.$menu.css({
    //             top: a.top + 10,
    //             left: a.left - 10
    //         })
    //     },
    //     className: 'word-file-context-menu',
    //     callback: function(key, options) {
    //         var parentId = $(this).closest('[id]').attr('id');
    //         var k = key;
    //         switch (key) {
    //             case "new":
    //                 //e.preventDefault();
    //                 self.newWord();
    //                 break;
    //             case "open":
    //                 //e.preventDefault();
    //                 self.showOpen(parentId);
    //                 break;
    //             case "close":
    //             case "exit":
    //                 $('#' + parentId + ' a.button-3d.close').trigger('click');
    //                 break;
    //             case "print":
    //                 $('#' + parentId + ' .toolbar .b-print').trigger('click');
    //                 break;
    //             case "save":
    //                 self.showSave(parentId);
    //                 break;
    //             case "saveAs":
    //                 self.showSave(parentId);
    //                 break;
    //             case "mail":
    //                 if ($('#' + parentId).attr('saved') === "true" && $('#' + parentId).attr('fileid') != 'undefined') {
    //                     self.newMail($('#' + parentId).attr('fileid'));
    //                 } else {
    //                     SystemUI.setDialogBox(parentId, 'Error', '1', 'Please save your file before you continue.');
    //                 }
    //                 break;
    //             default:
    //                 console.log('Shouldnt');
    //         }
    //     },
    //     items: {
    //         new: {
    //             name: "New",
    //             accesskey: "O",
    //             //className: "context-menu-bold",
    //             icon: function(opt, $itemElement, itemKey, item) {
    //                 // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                 $itemElement.html('<a class="b-new" aria-hidden="true"></a> <p><span class="context-menu-accesskey">N</span>ew</p>');
    //                 // Add the context-menu-icon-updated class to the item
    //                 return 'context-menu-icon-updated';
    //             }
    //         },
    //         open: {
    //             name: "Open",
    //             accesskey: "O",
    //             //className: "context-menu-bold",
    //             icon: function(opt, $itemElement, itemKey, item) {
    //                 // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                 $itemElement.html('<a class="b-open" aria-hidden="true"></a> <p><span class="context-menu-accesskey">O</span>pen</p>');
    //                 // Add the context-menu-icon-updated class to the item
    //                 return 'context-menu-icon-updated';
    //             }
    //         },
    //         close: {
    //             name: "Close",
    //             accesskey: "C"
    //         },
    //         "sep1": "---------",
    //         save: {
    //             name: "Save",
    //             accesskey: "s",
    //             //className: "context-menu-bold",
    //             icon: function(opt, $itemElement, itemKey, item) {
    //                 // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                 $itemElement.html('<a class="b-save" aria-hidden="true"></a> <p><span class="context-menu-accesskey">S</span>ave</p>');
    //                 // Add the context-menu-icon-updated class to the item
    //                 return 'context-menu-icon-updated';
    //             }
    //         },
    //         saveAs: {
    //             name: "Save As",
    //             accesskey: "A"
    //         },
    //         saveAsHtml: {
    //             name: "Save As HTML",
    //             accesskey: "H",
    //             disabled: true
    //         },
    //         version: {
    //             name: "Versions",
    //             accesskey: "V",
    //             disabled: true
    //         },
    //         "sep2": "---------",
    //         pageSet: {
    //             name: "Page Setup",
    //             accesskey: "u",
    //             disabled: true
    //         },
    //         printPreview: {
    //             name: "Print Preview",
    //             accesskey: "v",

    //             //className: "context-menu-bold",
    //             icon: function(opt, $itemElement, itemKey, item) {
    //                 // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                 $itemElement.html('<a class="b-preview" aria-hidden="true"></a> <p>Print Pre<span class="context-menu-accesskey">v</span>iew </p>');
    //                 // Add the context-menu-icon-updated class to the item
    //                 return 'context-menu-icon-updated';
    //             },
    //             disabled: true
    //         },
    //         print: {
    //             name: "Print",
    //             accesskey: "P",
    //             //className: "context-menu-bold",
    //             icon: function(opt, $itemElement, itemKey, item) {
    //                 // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                 $itemElement.html('<a class="b-print" aria-hidden="true"></a> <p><span class="context-menu-accesskey">P</span>rint</p>');
    //                 // Add the context-menu-icon-updated class to the item
    //                 return 'context-menu-icon-updated';
    //             }
    //         },
    //         "sep3": "---------",
    //         sendTo: {
    //             name: "Send To",
    //             accesskey: "T",
    //             items: {
    //                 mail: {
    //                     name: "Mail Recipient",
    //                     accesskey: "M",
    //                     icon: function(opt, $itemElement, itemKey, item) {
    //                         // Set the content to the menu trigger selector and add an bootstrap icon to the item.
    //                         $itemElement.html('<a class="b-mail" aria-hidden="true"></a> <p><span class="context-menu-accesskey">M</span>ail Recipient...</p>');
    //                         // Add the context-menu-icon-updated class to the item
    //                         return 'context-menu-icon-updated';
    //                     }
    //                 }
    //             }
    //         },
    //         properties: {
    //             name: "Properties",
    //             accesskey: "r",
    //             disabled: true
    //         },
    //         "sep4": "---------",
    //         exit: {
    //             name: "Exit",
    //             accesskey: "e"
    //         }
    //     }
    // });
    //Notepad Context Menu
    $.contextMenu({
      selector: ".notepad .menu-bar .file",
      //appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
      trigger: "left",
      position: function (opt) {
        const a = this.offset();
        opt.$menu.css({
          top: a.top + 10,
          left: a.left - 10,
        });
      },
      className: "notepad-file-context-menu",
      callback: function (key) {
        const parentId = $(this).closest("[id]").attr("id");
        switch (key) {
          case "new":
            $("#desktop-icon-5").trigger("dblclick");
            break;
          case "open":
            //e.preventDefault();
            self.showOpen(parentId);
            break;
          case "exit":
            $(`#${parentId} a.button-3d.close`).trigger("click");
            break;
          case "print":
            self.printFile(parentId);
            break;
          case "save":
            self.showSave(parentId);
            break;
          case "saveAs":
            self.showSave(parentId);
            break;
          default:
            console.log("Shouldnt");
        }
      },
      items: {
        new: {
          name: "New",
          accesskey: "O",
        },
        open: {
          name: "Open",
          accesskey: "O",
        },
        sep1: "---------",
        save: {
          name: "Save",
          accesskey: "s",
        },
        saveAs: {
          name: "Save As",
          accesskey: "A",
        },
        sep2: "---------",
        pageSet: {
          name: "Page Setup",
          accesskey: "u",
          disabled: true,
        },
        print: {
          name: "Print",
          accesskey: "P",
        },
        sep3: "---------",
        exit: {
          name: "Exit",
          accesskey: "e",
        },
      },
    });
  }
}
