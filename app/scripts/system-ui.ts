import { ProcessManager } from "./process";
import {
	findNearestId,
	findNearestPid,
	getWindowDimensions,
	isFirstLogin,
	parseNumber,
} from "./util";
import { MsWord } from "./applications/msword";
import { Notepad } from "./applications/notepad";
import { MailClient } from "./applications/mail-client";
import { ProgramData } from "./program-data";
import { Kernel } from "./kernel";
import { Sound } from "./sound";
import type { LaunchableApplications, UserFile } from "application";
import type { ClippyAgent } from "clippy";
import db from "./storage";

let zIndex = 100;

export class SystemUI extends ProcessManager {
	botOpen = false;
	botWord = false;
	h = 0;
	w = 0;
	topInit = 0;
	leftInit = 0;
	topVal = 0;
	leftVal = 0;
	totalheight = 0;
	totalwidth = 0;
	offsetpx = 0;
	top1 = 0;
	left1 = 0;
	taskWidth = 0;
	iconNumber = 0;
	iconTop = 0;
	iconLeft = 0;
	botSave = false;
	init(): void {
		this.windowInitalPositionValues();
		this.contextMenuInit();
		this.runInit();
	}
	eventListeners(): void {
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
			const pid = parseNumber(findNearestPid.call(this) ?? "0");
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
			const pid = parseNumber(findNearestPid.call(this) ?? "0");
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
				self.setActive(parseNumber($(this).attr("pid") ?? "0"));
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
				const pid = parseNumber(findNearestPid.call(this) ?? "0");
				self.maximize(pid);
			},
		);

		// ------------------------------------------------ msword events(So Event's are not init everytime new word) -----------------------------------------------//

		$("#desktop").on("click", ".b-new", () => {
			self.newWord();
		});
		$("#desktop").on("click", ".b-save", function (e) {
			e.preventDefault();
			const parentId = findNearestId.call(this);
			if (!parentId) return;
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
			const parentId = findNearestId.call(this);
			if (!parentId) return;
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
			const parentId = findNearestId.call(this);
			if (!parentId) return;
			self.printFile(parentId);
		});
		//------------------------------------------------ Mail Events -------------------------------------------------------//

		$("#desktop").on("click", ".b-attach", function (e) {
			e.preventDefault();
			const parentId = findNearestId.call(this);
			if (!parentId) return;
			const attachSel = `#${parentId} #attach`;
			$(attachSel).css("display", "block");
			// .draggable({
			// 	handle: '.title-bar'
			// });
			self.updateContentBox(attachSel);
			const offset = $(attachSel).offset();
			if (offset) {
				$(attachSel).css({
					top: offset.top,
					left: offset.left,
					position: "fixed",
				});
			}
			$(`#${parentId}`).closest("[id]").css("pointer-events", "none");
			$(attachSel).css("pointer-events", "auto");
		});
		$("#desktop").on("click", ".attachment .cancel", function () {
			$(this).parent().remove();
		});
		$("#desktop").on("click", ".b-send", function (e) {
			e.preventDefault();
			const parentId = findNearestId.call(this);
			if (!parentId) return;
			self.sendEmail(parentId);
		});
		//------------------------------------------------- RUN EVENTS -------------------------------------------------//
		$("#menu-8").on("click", () => {
			$("#run").draggable({
				handle: ".title-bar",
			});
			self.setActive(parseNumber($("#run").attr("pid") ?? "0"));
		});
		$("#run .ok-button").on("click", function () {
			if ($(this).val() === "ok") {
				self.runProgram(($("#run input").val() ?? "").toString());
			} else {
				$("#run").css("display", "none");
			}
		});
		$("#run .close-run,#run .close-button").on("click", function () {
			const pid = parseNumber(findNearestPid.call(this) ?? "0");
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
			const fileId = $(this).attr("fileid");
			if (!p1 || !fileId) return;
			const file = Kernel.getFileFromLocal(parseNumber(fileId));
			if (!file) return;
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

			window.open($(this).attr("url") ?? "");
		});
		//------------------------------------------------ Properties Events --------------------------------------//
		$("#desktop").on("click", ".properties .button", function () {
			const parentID = findNearestId.call(this);
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
			const parentId = findNearestId.call(this);
			const fatherId = $(this)
				.closest("[id]")
				.parent()
				.closest("[id]")
				.attr("id");
			if (!parentId || !fatherId) return;

			$(`#${fatherId} #${parentId}`).css("display", "none");
			$(`#${fatherId}`).css("pointer-events", "auto");
		});

		$("#desktop").on("click", ".save-button", function () {
			self.save(this);
		});
		$("#desktop").on("click", ".desktop-ico", function () {
			const saveLocation = $(this).siblings("#save-location");
			if (saveLocation.length) {
				saveLocation.val("desktop");
			}
		});
		$("#desktop").on("click", ".open-button", function () {
			self.open(this);
		});
		$("#desktop").on("click", ".attach-button", function () {
			self.attach(this);
		});
		let lol: string | undefined;
		$("#desktop").on("click", ".user-file-list", function (e) {
			//$('.user-file-list').children().css('background', 'none');
			const a = $(this).children().text();
			lol = $(this).attr("type");
			const file = $(this).attr("fileid");
			const windowType = findNearestPid.call(this);
			if (e.shiftKey) {
				if (windowType === "attach") {
					$(this).addClass("selected");
					const oldVal = (
						$(this).closest("[id]").find(".fileID").val() ?? ""
					).toString();
					let oldVal1 = (
						$(this).closest("[id]").find(".filename").val() ?? ""
					).toString();
					if (oldVal1.indexOf('"') < 0) oldVal1 = `"${oldVal1}"`;
					//var oldVal2 = $(this).closest('[id]').find('#file-type').val();
					$(this).closest("[id]").find(".filename").val(`${oldVal1} "${a}"`);
					$(this).closest("[id]").find(".fileID").val(`${oldVal}|${file}`);
					$(this).closest("[id]").find("#file-type").val("none");
				} else {
					$(".user-file-list").removeClass("selected");
					$(this).closest("[id]").find(".filename").val(a);
					if (lol !== undefined) {
						$(this)
							.closest("[id]")
							.find("#file-type")
							.val(lol as string);
					}
					if (file !== undefined) {
						$(this)
							.closest("[id]")
							.find(".fileID")
							.val(file as string);
					}
				}
			} else {
				$(".user-file-list").removeClass("selected");
				$(this).toggleClass("selected");
				$(this).closest("[id]").find(".filename").val(a);
				$(this)
					.closest("[id]")
					.find("#file-type")
					.val(lol as string);
				$(this)
					.closest("[id]")
					.find(".fileID")
					.val(file as string);
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
		$("#dialog button").on("click", () => {});

		//----------------------------------------------- TaskBar Events ----------------------------------------------//		//
		$("#menu-2").on(
			"hover",
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
		$(document).on("mouseup", (e) => {
			const container = $("#start-menu");

			if (
				!container.is(e.target as unknown as HTMLElement) && // if the target of the click isn't the container...
				container.has(e.target as unknown as HTMLElement).length === 0
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
			const pid = parseNumber($(this).attr("pid") ?? "0");
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
				if ($(this).attr("pid")) {
					self.minimize(parseNumber($(this).attr("pid") ?? "0"));
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
	async program(iconSelector: HTMLElement): Promise<void> {
		let p: LaunchableApplications;
		let processID: number | undefined;

		const selector = $(iconSelector);
		const program = selector.attr("program-name");
		const fileID = selector.attr("fileid")
			? parseNumber(selector.attr("fileid"))
			: undefined;
		processID = this.isOpen(fileID);
		if (typeof processID === "number" && processID > 0) {
			// console.log('processID' + processID);
			this.setActive(processID);
		} else {
			processID = await super.newProcess();
			switch (program) {
				case "msword":
					p = await new MsWord(processID, fileID).create();
					if (this.botOpen === false) {
						window.globalBot.agent((a: ClippyAgent) => {
							const { width, height } = getWindowDimensions();
							a.moveTo(width * 0.75, height * 0.75);
							a.speak(
								"This is Microsoft Word. You can edit files and save them to the desktop which is internally stored in your browser. You can also download the file to your own computer.",
							);
						});
						this.botWord = true;
					}
					break;
				case "notepad":
					p = await new Notepad(processID, fileID).create();
					break;
				case "mail":
					window.globalBot.agent((a: ClippyAgent) => {
						const { width, height } = getWindowDimensions();
						a.moveTo(width * 0.75, height * 0.75);
						a.speak(
							"Welcome to the mail client. You can compose emails here. If you want to get in touch with me contact me on rahulmehra@techgeek.co.in.",
						);
					});
					p = await new MailClient(processID).create();
					break;
				case "wolf-3d": {
					const a = this.isRunning(program);
					if (!a) {
						p = await import("./applications/wolf3d").then(
							(module) => new module.Wolf3d(processID as number).create(),
						);
					} else {
						this.setActive(a);
					}
					break;
				}
				case "minesweeper": {
					const a = this.isRunning(program);
					if (!a) {
						p = await import("./applications/minesweeper").then(
							async (module) =>
								await new module.Minesweeper(processID as number).create(),
						);
					} else {
						this.setActive(a);
					}
					break;
				}
				case "winamp": {
					const a = this.isRunning(program);
					if (!a) {
						p = await import("./applications/winamp").then(
							async (module) =>
								await new module.Winamp(processID as number).create(),
						);
					} else {
						this.setActive(a);
					}
					break;
				}
				case "recyclebin":
					this.beforeLogoff(true);
					break;
				case "explorer":
					p = await import("./applications/explorer").then(
						async (module) =>
							await new module.Explorer(
								processID as number,
								selector.attr("directory") ?? "",
							).create(),
					);
					break;
			}
			if (p && program) {
				super.updateProcess(processID, program, p.windowID, p.description);
				this.setWindowPosition(p.windowID);
				this.appendTask(processID, program, p.windowID, p.description);
				this.setActive(processID);
			} else {
				console.log("No Process Returned");
			}
		}
	}
	isOpen(fileID: number | undefined): number | undefined {
		let processID: number | undefined;
		// if ($('.window[fileid="' + fileID + '"]').length != 0) {
		//     processID = $('.window[fileid="' + fileID + '"]').attr('pid');
		// }
		// return processID;
		$(".window").each(function () {
			const $w = $(this);
			const wfileID = $w.attr("fileid");
			if (wfileID && wfileID !== 'undefined' && fileID === parseNumber(wfileID)) {
				const pid = $w.attr("pid");
				if (pid) {
					processID = parseNumber(pid);
					return false;
				}
			}
		});
		if (processID === undefined) {
			return;
		}
		return processID;
	}
	isRunning(program: string): number | undefined {
		let a: number | undefined = undefined;
		if ($(`.window[program-name="${program}"]`).length !== 0) {
			a = parseNumber(
				$(`.window[program-name="${program}"]`).attr("pid") ?? "0",
			);
		}
		return a;
	}
	close(closeButton: HTMLElement): void {
		let windowID = $(closeButton).closest("[pid]").attr("id") ?? "";
		windowID = `#${windowID}`;
		const pid = parseNumber($(windowID).attr("pid") ?? "0");
		const program = $(windowID).attr("program-name") ?? "";
		switch (program) {
			case "msword":
				MsWord.remove($(windowID).attr("document-number") ?? "", (close) => {
					this.programClose(pid, close);
				});
				break;
			default:
				this.programClose(pid, true);
		}
	}
	async properties(fileID: number): Promise<void> {
		const processID = await this.newProcess();
		this.newProperties(processID, fileID);
	}
	async newProperties(processID: number, fileID: number): Promise<void> {
		const file = (await this.getFileFromLocal(fileID)) as UserFile;
		const size = JSON.stringify(file).length * 2;
		const cdate = new Date(file.creationDate);
		//var created = cdate.getDay() + ', ' + cdate.getMonth() + cdate.getDate() +', '+ cdate.getFullYear() +' '+ cdate.getHours() +':'+cdate.getMinutes()+':'+cdate.getSeconds()+' ';
		const created = `${cdate.toDateString()}, ${cdate.toLocaleTimeString()}`;
		const mdate = new Date(file.modifiedDate);
		//var modified = mdate.getDay() + ', ' + mdate.getMonth() + mdate.getDate() +', '+ mdate.getFullYear() +' '+ mdate.getHours() +':'+mdate.getMinutes()+':'+mdate.getSeconds()+' '+mdate.getHours() >= 12 ? 'PM' : 'AM';
		const modified = `${mdate.toDateString()}, ${mdate.toLocaleTimeString()}`;
		const iconURL = ProgramData.getIconByType(file.type);
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
		const off = $(`.desktop-icon[fileid="${file.id}"]`).offset() ?? {
			top: 0,
			left: 0,
		};
		const { height } = getWindowDimensions();
		off.top = off.top >= height / 2 ? height / 2 - 32 : off.top;
		$(`#properties-${processID}`).css({
			top: off.top + 32,
			left: off.left + 32,
		});
		this.setActive(processID);
	}
	maximize(pid: number): void {
		const windowID = $(`.window[pid="${pid}"]`).attr("id");
		if ($(`#${windowID}`).hasClass("wolf")) return;
		const { width, height: wHeight } = getWindowDimensions();
		const height = wHeight - 22;
		const s = $(`.window[pid="${pid}"]`).find(".maximize").attr("state") ?? "";
		if (s === "min") {
			this.beforeWindow(pid, () => {
				if (!$(`.window[pid="${pid}"]`).is(":animated")) {
					$(`.window[pid="${pid}"]`).animate({
						opacity: 1,
						top: 0,
						left: 0,
						height: `${height}px`,
						width: width,
					});
					$(`.window[pid="${pid}"]`).find(".maximize").attr("state", "max");
					if ($(`#${windowID}`).hasClass("word")) {
						const docHeight =
							height -
							(($(`#${windowID} .toolbar`).outerHeight() ?? 0) * 3 +
								60 +
								($(`#${windowID} .status-bar`).outerHeight() ?? 0) +
								($(".title").outerHeight() ?? 0));
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
					$(`.window[pid="${pid}"]`).draggable("disable");
					$(`.window[pid="${pid}"]`).resizable("disable");
				}
			});
		} else if (s === "max") {
			const windowData = $(
				`.window[pid="${pid}"]`,
			).data() as JQuery.PlainObject<any>;
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
				$(`.window[pid="${pid}"]`).draggable("enable");
				$(`.window[pid="${pid}"]`).resizable("enable");
			}
		}
	}
	minimize(pid: number): void {
		let windowID = $(`.window[pid="${pid}"]`).attr("id") ?? "";
		windowID = `#${windowID}`;
		//var pid = $(windowID).attr('pid');
		const state =
			$(`.window[pid="${pid}"]`).find(".maximize").attr("state") ?? "";
		if (state === "max") {
			this.programMinimize(pid);
		} else if (state === "min") {
			this.beforeWindow(pid, () => {
				this.programMinimize(pid);
			});
		}
	}
	//top: 54.3px; left: 634.333px; height: 305.58px; width: 939.5px; z-index: 102; display: block;
	beforeWindow(pid: number, callback: () => void): void {
		$(`.window[pid="${pid}"]`)
			.promise()
			.done(() => {
				const $windowID = $(`.window[pid="${pid}"]`);
				const originalOffset = $windowID.offset();
				const originalTop = originalOffset?.top ?? 0;
				const originalLeft = originalOffset?.left ?? 0;
				const originalPosition = $windowID.css("position");
				const originalHeight = $windowID.outerHeight();
				const originalWidth = $windowID.outerWidth();
				const originalDisplay = $windowID.css("display");
				const originalOpacity = $windowID.css("opacity");
				let originalContentHeight = 0;
				if ($(`.window[pid="${pid}"]`).hasClass("word")) {
					originalContentHeight =
						$windowID.find(".document-content").outerHeight() ?? 0;
				} else if ($(`.window[pid="${pid}"]`).hasClass("mail")) {
					originalContentHeight =
						$windowID.find(".mail-content").outerHeight() ?? 0;
				} else if ($(`.window[pid="${pid}"]`).hasClass("notepad")) {
					originalContentHeight =
						$windowID.find(".document-wrap").outerHeight() ?? 0;
				} else if ($(`.window[pid="${pid}"]`).hasClass("explorer")) {
					originalContentHeight =
						$windowID.find("#explorer-content").outerHeight() ?? 0;
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

	programClose(pid: number, close: boolean): void {
		if (close === true) {
			this.removeWindow(pid);
			this.removeProcess(pid);
			this.removeTask(pid);
		}
	}
	programMinimize(pid: number): void {
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
	setInActive(pid: number): void {
		this.setTaskInActive();
		this.setProcessInActive(pid);
		this.minimize(pid);
	}
	setActive(pid: number): void {
		this.setTaskActive(pid);
		this.setProcessActive(pid);
		this.setWindowActive(pid);
	}
	//----------------------------------------------- MAIN WINDOW FUNCTIONS -----------------------------------------//
	/**
	 * Set Window Inital positions.
	 * @return {nothing}
	 */
	async windowInitalPositionValues(): Promise<void> {
		const { width, height } = getWindowDimensions();

		this.topInit = height / 12;
		this.leftInit = width / 6;
		this.topVal = height / 10;
		this.leftVal = width / 3;
		this.totalheight = height / 4;
		this.totalwidth = width / 2;
		this.offsetpx = 32;
		this.top1;
		this.left1;
		this.taskWidth = 219;
		this.iconNumber = 20;
		this.iconTop = 0;
		this.iconLeft = 0;
		if (await isFirstLogin()) {
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
	 * @param {windowId}- The ID of the window to set position for.
	 * @return nothing
	 */
	setWindowPosition(windowId: string): void {
		const { height } = getWindowDimensions();
		const pid = $(windowId);
		if ($(windowId).hasClass("winamp")) return;
		const offset = pid.offset();
		if (!offset) return;
		this.top1 = offset.top + this.topVal;
		this.topVal = this.topVal + this.offsetpx;
		this.left1 = offset.left + this.leftVal;
		this.leftVal = this.leftVal + this.offsetpx;
		pid.offset({
			top: this.top1,
			left: this.left1,
		});
		$(`${windowId} .document-content`).height(height * 0.6);
		$(`${windowId} .mail-content`).height(height * 0.6 - 246);
		if (this.topVal > this.totalheight) {
			this.topVal = this.topInit;
			this.leftVal = this.leftVal + 32;
		}
		if (this.leftVal > this.totalwidth) {
			this.topVal = this.topVal + 32;
			this.leftVal = this.leftInit;
		}
	}

	setWindowActive(pid: number): void {
		let windowData: JQuery.PlainObject<any> = {};
		const $pid = $(`.window[pid="${pid}"]`);
		const state = $pid.find(".maximize").attr("state") ?? "";
		if (!$(`.window[pid="${pid}"]`).is(":animated")) {
			if ($pid.css("opacity") === "0") {
				if (state === "max") {
					const { height: wHeight } = getWindowDimensions();
					const height = wHeight - ($("#taskbar")?.outerHeight() || 27);
					$(`.window[pid="${pid}"]`).animate({
						opacity: 1,
						top: 0,
						left: 0,
						height: `${height}px`,
						width: $(window).width(),
					});
					if ($(`.window[pid="${pid}"]`).hasClass("word")) {
						const docHeight =
							height -
							(($(`.window[pid="${pid}"] .toolbar`).outerHeight() ?? 0) * 3 +
								48 +
								($(`.window[pid="${pid}"] .status-bar`).outerHeight() ?? 0) +
								($(".title").outerHeight() ?? 0));
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
		if (!$pid.hasClass("winamp")) {
			$pid.addClass("active-window");
		}
	}
	setWindowInActive(): void {
		$(".window").removeClass("active-window");
	}
	removeWindow(pid: number): void {
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
	minimizeWindow(pid: number): void {
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
	shutdown(): void {
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
					switch (($("input[name=shut]:checked").val() ?? "").toString()) {
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
	beforeSystemClose(parentID: string, callback: (e: boolean) => void): void {
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
	beforeFinalShutdown(shut: string): void {
		this.beforeSystemClose("shutdown", async (e: boolean) => {
			if (e) {
				if (shut === "shutdown") {
					this.finalShutdown();
				} else if (shut === "restart") {
					this.restart();
				} else if (shut === "logoff") {
					await this.logoff();
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
	finalShutdown(): void {
		$("body").html("");
		$("body").css("background", "url(../images/shutdown.jpg) no-repeat center");
		Sound.play("sprite3");
		setTimeout(() => {
			$("body")
				.css("background", "none")
				.html(
					'<h1 style="text-align:center; margin:0 auto;">If you want to see more cool stuff.<br> Go to <a href = "https://github.com/lolstring/">https://github.com/lolstring/</a>.<br> You can contact me on <a href=rahulmehra@techgeek.co.in>rahulmehra@techgeek.co.in</a>.<br> <br><br> <a href="https://rahul.io">Power On</a></h1>',
				);
		}, 4000);
	}
	restart(): void {
		$("body").html("");
		$("body").css("background", "url(../images/shutdown.jpg) no-repeat center");
		Sound.play("sprite3");
		setTimeout(() => {
			location.reload();
		}, 2000);
	}
	static insertOverlay(id: string, background: boolean): void {
		let overlayData = "";
		if (background) {
			overlayData = `<div id="overlay" width="100%" height="100%" style="background:url(images/word%20images/background123.png);"></div>`;
		} else {
			overlayData = `<div id="overlay" width="100%" height="100%""></div>`;
		}
		$("body").append(overlayData);

		const z = 2147483644;
		$("#overlay").css("zIndex", z - 1);
		$(`#${id}`).css("zIndex", z);
		$("#overlay").on("click", (e) => {
			e.stopPropagation();
			Sound.play("sprite2");
		});
	}
	static removeOverlay(): void {
		$("#overlay").each(function () {
			$(this).remove();
		});
	}
	enterStandby(): void {
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
	exitStandBy(): void {
		SystemUI.removeOverlay();
		$("#standby").remove();
		$("#desktop").css("pointer-events", "auto");
	}

	// ----------------------------------- Destroy Session ---------------------------//

	async destroySession() {
		await db.delete();
		setTimeout(() => {
			location.reload();
		}, 0);
	}
	//------------------------------------Log off---------------------------------------------------//

	beforeLogoff(destroySession = false): void {
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
				self.beforeSystemClose("logoff #dialog", async (e: boolean) => {
					if (e) {
						if (destroySession) {
							self.destroySession();
						}
						$("#logoff").css("display", "none");
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
	async logoff(): Promise<void> {
		Sound.play("sprite3");
		// setTimeout(() => {
		// 	location.reload();
		// }, 4000);

		// var src="scripts/es2015.js";
		// $('script[src="' + src + '"]').remove();
		//      	$('<script>').attr('src', src).appendTo('head');
		$('#desktop').css('display','none');
		$('#desktop-icons .user-file').remove();
		$('#desktop .window').remove();
		$('.window-open').remove();
		$('#login').css('display','block');
	}
	//---------------------------------------------RUN _--------------------------------//
	runInit(): void {
		$("#combobox").combobox();
		//End Data*/f
	}
	async runProgram(value: string | number | string[]): Promise<void> {
		const v1 = value.toString().toLowerCase();
		const pid = parseNumber($("#run").attr("pid") ?? "0");
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
			const newValue = value.toString().replace(".doc", "");
			const fileId = await this.checkIfFileExists(newValue, "doc");
			if (fileId) {
				this.newWord(fileId);
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
			const newValue = value.toString().replace(".pdf", "");
			const a = await this.checkIfFileExists(newValue, "pdf");
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
			const newValue = value.toString().replace(".txt", "");
			const a = await this.checkIfFileExists(newValue, "txt");
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
				value.toString(),
				"1",
				`Cannot find the file ${value}. Make sure the path and filename are correct and that all required libraries are available.<br> Commands Supported:<br>&nbsp;&#149;Installed Executable<br>&nbsp;&#149;Filename with Extension<br>&nbsp;`,
			);
			return;
		}
		this.beforeWindow(pid, () => {
			this.programMinimize(pid);
		});
	}
	newWinamp(): void {
		throw new Error("Method not implemented.");
	}
	newWolf(): void {
		throw new Error("Method not implemented.");
	}
	//----------------------------------------------- SAVE/OPEN/ATTACH WINDOW FUNCTIONS -----------------------------------------//
	showOpen(parentId: string): void {
		//e.preventDefault();
		const openSel = `#${parentId} #open`;
		$(openSel).css("display", "block");
		// .draggable({
		// 	handle: '.title-bar'
		// });
		this.updateContentBox(openSel);
		const offset = $(openSel).offset() || { top: 0, left: 0 };
		$(openSel).css({
			top: offset.top,
			left: offset.left,
			position: "fixed",
		});
		$(`#${parentId}`).closest("[id]").css("pointer-events", "none");
		$(openSel).css("pointer-events", "auto");
		if (this.botOpen === false) {
			window.globalBot.agent(
				(a: {
					moveTo: (arg0: number, arg1: number) => void;
					speak: (arg0: string) => void;
				}) => {
					a.moveTo(offset.left + 150, offset.top + 150);
					a.speak("You can open a file from this desktop.");
				},
			);
			this.botOpen = true;
		}
	}
	showSave(parentId: string): void {
		const saveSel = `#${parentId} #save`;
		$(saveSel).css("display", "block");
		// .draggable({
		// 	handle: '.title-bar'
		// });
		this.updateContentBox(saveSel);
		const offset = $(saveSel).offset() || { top: 0, left: 0 };
		$(saveSel).css({
			top: offset.top,
			left: offset.left,
			position: "fixed",
		});
		$(`#${parentId}`).closest("[id]").css("pointer-events", "none");
		$(saveSel).css("pointer-events", "auto");

		if (this.botSave === false) {
			window.globalBot.agent((a) => {
				a.moveTo(offset.left + 150, offset.top + 150);
				a.speak(
					"You can save to desktop which is internally stored to Local Storage so be careful when you clear cache or you can download it to your own computer.",
				);
			});
			this.botSave = true;
		}
	}

	async updateContentBox(e: string): Promise<void> {
		const content = $(`${e} .content1-box`);
		//var childOffset1 ={top,left};
		$(`${e} .user-file-list`).remove();
		const files = await this.getFromLocal();
		let extension: string;
		let img = "";
		let type: string;
		let filename: any;

		// biome-ignore lint/complexity/noForEach: <explanation>
		files.forEach((file) => {
			//var a = memphis.getDesktopPos();
			type = file.type;
			filename = file.filename;
			extension = file.type;
			if (type === "doc" || type === "word") {
				extension = "doc";
				img = "images/win98_icons/WINWORD_2.ico";
			} else if (type === "pdf") {
				img = "images/win98_icons/pdf.png";
			} else if (type === "txt") {
				img = "images/win98_icons/notepad_file.ico";
			}
			//var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
			const iconData = `<div class="folder-list user-file-list" fileID="${file.id}" type="${extension}" tabindex="0"><img class="icon" src="${img}" style="width:14px;"/><span style="vertical-align:top">${filename}</span></div>`;
			$(iconData).appendTo(content);
		});
	}
	print(content: string, fileName = "Untitled"): void {
		const printWindow = window.open("", "", "height=400,width=800");
		if (!printWindow) {
			SystemUI.setDialogBox(
				"print",
				"Error",
				"1",
				"Unable to open print window. Please check your browser settings.",
			);
			return;
		}
		printWindow.document.body.innerHTML = `<html><head><title>${fileName}</title>`;
		printWindow.document.body.innerHTML += "</head><body>";
		printWindow.document.body.innerHTML += content;
		printWindow.document.body.innerHTML += "</body></html>";
		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	}
	printFile(parentId: string): void {
		const content = $(`#${parentId}-content .document-wrap`).html();
		const filename = $(`#${parentId}`).attr("document-title") ?? "";
		this.print(content, filename);
	}
	async open(windowId: HTMLElement): Promise<void> {
		const self = this;
		const parentId = $(windowId)
			.closest("[id]")
			.parent()
			.closest("[id]")
			.attr("id");
		const parentSel = `#${parentId}`;
		const sFileID = $(`${parentSel} #open .fileID`).val();
		const fileID = sFileID ? parseNumber(sFileID.toString()) : null;
		const filename = $(`${parentSel} #open input.filename`).val();
		if (filename === "" && parentId) {
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
			if (saved === "false" && parentId) {
				SystemUI.setDialogBox(
					parentId,
					"Microsoft Word",
					"4",
					"Are you sure you want to close before exiting?",
				);
				$(`${parentSel} #dialog button`).on("click", async function () {
					$(parentSel).css("pointer-events", "auto");
					const d = $(this).attr("value");

					if (d === "yes" && fileID) {
						const a = await self.getFileFromLocal(fileID);
						if (!a) return;
						$(parentSel)
							.children()
							.children()
							.children(".title")
							.text(a.filename);
						$(`#task-${parentId} p`).text(a.filename);
						$(parentSel).find(".document-wrap").html(a.content);
						$(parentSel).attr("fileid", a.id?.toString() ?? "");
						$(parentSel).attr("document-title", a.filename);
						MsWord._wordNumberRemove($(parentSel).attr("docNumber") ?? "");
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
				if (fileID) {
					const a = await this.getFileFromLocal(fileID);
					if (!a) return;
					$(parentSel)
						.children()
						.children()
						.children(".title")
						.text(a.filename);
					$(`#task-${parentId} p`).text(a.filename);
					$(parentSel).find(".document-wrap").html(a.content);
					$(parentSel).attr("fileid", a.id?.toString() ?? "");
					MsWord._wordNumberRemove($(parentSel).attr("docNumber") ?? "");
					$(`${parentSel} #open`).css("display", "none");
					$(parentSel).css("pointer-events", "auto");
					$(parentSel).attr("saved", "true");
				}
			}
		}
	}
	async save(windowId: HTMLElement): Promise<void> {
		const parentId =
			$(windowId).closest("[id]").parent().closest("[id]").attr("id") ?? "";
		const parentSel = `#${parentId}`;
		const type = (
			$(`${parentSel} #save select#file-type`).val() ?? ""
		).toString();
		const location = $(`${parentSel} #save select#save-location`)
			.val()
			?.toString();
		const filename = (
			$(`${parentSel} #save input.filename`).val() ?? ""
		).toString();
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
				await this.saveToLocal(parentId, filename, contentDocument, type);
				const c = `${filename} - Microsoft Word`;
				$(parentSel).children().children().children(".title").text(c);
				$(`#task-${parentId} p`).text(filename);
				$(`${parentSel} #save`).css("display", "none");
				$(parentSel).css("pointer-events", "auto");
			} else if (location === "computer") {
				this.saveFile(parentId, filename, type);
				$(`${parentSel} #save`).css("display", "none");
			} else if (!location) {
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
	async getFromLocal(): Promise<UserFile[]> {
		const currentUser = await this.getCurrentUser();
		if (!currentUser) {
			return [];
		}
		const files: UserFile[] = await db.files
			.filter((file) => file.userId === currentUser.id || file.static)
			.toArray();
		return files;
	}
	private async getCurrentUser() {
		return await Kernel.getCurrentUser();
	}

	async getFileFromLocal(fileID: number): Promise<UserFile | undefined> {
		return await Kernel.getFileFromLocal(fileID);
	}

	async saveToLocal(
		parentId: string,
		filename: string,
		contentDocument: string,
		type: string,
	): Promise<void> {
		$(`#${parentId}`).attr("saved", "true");
		const program = $(`#${parentId}`).attr("program-name") ?? "";
		const currentUser = await this.getCurrentUser();
		if (!currentUser) return;
		const exists = await this.checkIfFileExists(filename, type);
		if (exists) {
			if (Number.parseInt($(`#${parentId}`).attr("fileid") ?? "") !== exists) {
				SystemUI.setDialogBox(
					parentId,
					"Microsoft Word",
					"4",
					`Do you want to replace the existing ${filename}.${type}?`,
				);
				$(`#${parentId} #dialog button`).on("click", async function () {
					const d = $(this).attr("value");
					if (d === "yes") {
						await db.files
							.where({
								id: exists,
								userId: currentUser.id,
							})
							.modify({
								content: contentDocument,
								modifiedDate: Date.now(),
							});
						$(`#${parentId} #dialog`).css("display", "none");
					} else if (d === "no") {
						$(`#${parentId} #dialog`).css("display", "none");
						$(`#${parentId} #save`).css("display", "block");
					} else if (d === "cancel") {
						$(`#${parentId} #dialog`).css("display", "none");
					}
				});
			} else {
				// Update existing file
				await db.files
					.where({
						id: exists,
					})
					.modify({
						content: contentDocument,
						modifiedDate: Date.now(),
					});
				$(`#${parentId}`).attr("fileid", exists.toString());
			}
		} else if (!exists) {
			const userFile: Omit<UserFile, "id"> = {
				filename: filename,
				content: contentDocument,
				type: type,
				extension: type,
				program: program,
				creationDate: Date.now(),
				modifiedDate: Date.now(),
				userId: currentUser.id,
				static: false,
			};
			const fid = await db.files.add(userFile);
			if (fid) {
				this.setNewDesktop(fid, program, filename, type);
			}
		}
	}

	async checkIfFileExists(
		filename: string,
		type: string,
	): Promise<number | false> {
		const currentUser = await this.getCurrentUser();
		if (!currentUser) return false;
		const file = await db.files
			.where("userId")
			.equals(currentUser.id)
			.and((f) => f.filename === filename && f.type === type)
			.first();
		if (file?.id) {
			return file.id;
		}
		return false;
	}
	async rename(fileID: string, filename: string): Promise<void> {
		const currentUser = await this.getCurrentUser();
		if (!currentUser) return;

		const file = await db.files
			.where({
				userId: currentUser.id,
				id: fileID,
			})
			.first();
		if (file) {
			file.filename = filename;
			file.modifiedDate = Date.now();
			await db.files.put(file);
		}
		const pid = $(`.window[fileid="${fileID}"]`).attr("pid") ?? "";
		$(`.window[fileid="${fileID}"]`).find(".title").text(filename);
		$(`.window[fileid="${fileID}"]`).attr("document-title", filename);
		$(`#taskbar [pid="${pid}"] p`).text(filename);
	}
	async saveFile(
		parentId: string,
		filename: string,
		type: string,
	): Promise<void> {
		if (type === "pdf") {
			$(`#${parentId}`).css("pointer-events", "auto");
			this.printFile(parentId);
			// return xepOnline.Formatter.Format(`${parentId}-content .document-wrap`, {
			//   render: "download",
			//   filename: filename,
			//   //attach:parentId,
			//   //fileID:'file-1473946043124'
			// });
		}
		if (type === "word" || type === "doc") {
			this.convertImagesToBase64(parentId);
			await import("html-docx-js/dist/html-docx").then(async (htmlDocx) => {
				//$.cachedScript("../vendor/html-docx.js").done(function(script, textStatus) {
				const contentDocument = $(`#${parentId}-content`).html();
				const content = `<!DOCTYPE html><html><head></head><body>${contentDocument}</body></html>`;
				const orientation = "portrait";
				const converted = htmlDocx.default.asBlob(content, {
					orientation,
				});
				await import("file-saver").then((FileSaver) =>
					FileSaver.saveAs(converted as Blob, `${filename}.docx`),
				);
			});
			$(`#${parentId}`).css("pointer-events", "auto");
			return;
		}
		if (type === "txt") {
			const contentTxt = $(`#${parentId}-content`).text().trim();
			const blob = new Blob([contentTxt], {
				type: "text/plain;charset=utf-8",
			});
			await import("file-saver").then((FileSaver) =>
				FileSaver.saveAs(blob, `${filename}.txt`),
			);
			$(`#${parentId}`).css("pointer-events", "auto");
			return;
		}
		$(`#${parentId}`).css("pointer-events", "auto");
	}
	convertImagesToBase64(parentId: string): void {
		const regularImages = $(`#${parentId}-content img`);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			console.error("Canvas context is not available.");
			return;
		}
		[].forEach.call(regularImages, (imgElement: HTMLImageElement) => {
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
	async deleteFile(fileID: number): Promise<void> {
		window.globalBot.agent((a) => {
			a.speak("Are you sure you want to delete this file?");
		});
		const currentUser = await this.getCurrentUser();
		const file = await db.files
			.where({
				id: fileID,
				userId: currentUser?.id,
			})
			.first();

		if (file?.static) {
			SystemUI.setDialogBox(
				"desktop",
				"Error",
				"1",
				"You can not delete this file.",
			);
			return;
		}
		if (file) {
			await db.files
				.where({
					id: fileID,
					userId: currentUser?.id,
				})
				.delete();
		}
		$(`.desktop-icon[fileid="${fileID}"`).remove();
		$(`.window[fileid="${fileID}"]`).attr("saved", "false");
	}
	async attach(windowId: HTMLElement): Promise<void> {
		const parentId =
			$(windowId).closest("[id]").parent().closest("[id]").attr("id") ?? "";
		const parentSel = `#${parentId}`;
		const fileids = $(`${parentSel} #attach .fileID`)
			.val()
			?.toString()
			.split("|");
		if (!fileids || fileids.length < 1) {
			SystemUI.setDialogBox(
				parentId,
				"Error",
				"1",
				"Please select a file to attach.",
			);
			return;
		}
		for (let i = 0; i < fileids.length; i++) {
			await this.attachCreate(parentSel, parseNumber(fileids[i]));
		}
	}
	async attachCreate(parentID: string, fileID: number): Promise<void> {
		let fileBlob: string | Blob;
		if (fileID) {
			const file = await this.getFileFromLocal(fileID);
			fileBlob = "";
			if (file) {
				if (file.type === "pdf") {
					fileBlob = "pdf";
					this.attachAppend(parentID, file, fileBlob);
				} else {
					this.fileToBlob(file.content, file.type, (abc: string | Blob) => {
						fileBlob = abc;
						this.attachAppend(parentID, file, fileBlob);
					});
				}
			} else {
				console.error(`File with ID ${fileID} not found.`);
				return;
			}
		} else {
			return;
		}
	}
	attachAppend(
		parentID: string,
		file: UserFile,
		fileBlob: string | Blob,
	): void {
		if ($(`${parentID} div.attachment [file-id="${file.id}"]`).length < 1) {
			const iconURL = ProgramData.getIconByType(file.type);
			const attachData = `<div file-id="${file.id}" class="attached-list">
		<img class="icon" src="${iconURL}"/>
		<span>${file.filename}</span>
		<div class="cancel" >
		&nbsp;
		</div>
		</div>`;
			$(attachData).appendTo(`${parentID} div.attachment`);
			$(`[file-id="${file.id}"]`).data({
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
	async fileToBlob(
		contentDocument: string,
		type: string,
		callback: (blob: string | Blob) => void,
	): Promise<void> {
		let blob: string | Blob;
		const cd = contentDocument;
		if (type === "word" || type === "doc") {
			await import("html-docx-js/dist/html-docx").then(async (htmlToDocx) => {
				//$.cachedScript("vendor/html-docx.js").done(function(script, textStatus) {
				const content = `<!DOCTYPE html><html><head></head><body>${cd}</body></html>`;
				const orientation = "portrait";
				blob = htmlToDocx.default.asBlob(content, {
					orientation,
				});

				callback(blob);
			});
		} else if (type === "text" || type === "txt") {
			const contentTxt = cd.trim();
			blob = new Blob([contentTxt], {
				type: "text/plain;charset=utf-8",
			});
			callback(blob);
		} else {
			throw new Error("Unsupported file type for blob conversion.");
		}
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
	appendTask(
		processID: number,
		program: string,
		windowID: string,
		description: string,
	) {
		const newWindowID = windowID.substring(1);
		const taskID = `task-${newWindowID}`;
		const iconURL = ProgramData.getIcon(program) ?? "";
		const taskbarData = `<span class="window-open" id="${taskID}" pid="${processID}" program-name="${program} "title="${description}">
			<img class="icon" src="${iconURL}"/>
			<p class="text">${description}</p>
		</span>`;
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
		const availableWidth = ($("#taskbar").outerWidth() || 27) - 228;
		const numberOpen = $(".window-open").length;
		if ($(".window-open")) {
			const maxWidthPx = $(".window-open").css("max-width");
			if (!maxWidthPx) {
				console.error("Max width not set for window-open elements.");
				return;
			}
			const maxWidth = parseNumber(maxWidthPx.replace("px", ""));
			let width: number;
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
		} else {
			console.log("No open windows to set task position.");
		}
	}
	taskSplit(): void {
		const childNodes = $(".window-open");
		const numberFit =
			Math.round((($("#taskbar").outerWidth() || 27) - 228) / 30) - 11;
		const totalChildNodes = childNodes.length;
		const numberOfPages = Math.ceil(totalChildNodes / numberFit);
		const parentElement = $('<span id="task"></span>');
		let temp: string;
		let i: number;
		let j = 1;
		let k = 0;
		for (i = 1; i <= numberOfPages; i++) {
			temp = `<span id="task-${i}" class="task-page" style="display:none;" page-num="${i}"></span>`;
			$(parentElement).append(temp);
		}
		for (i = 0; i < totalChildNodes; i++) {
			k++;
			$(parentElement).children(`#task-${j}`).append(childNodes[i]);
			if (k >= numberFit) {
				j++;
				k = 0;
			}
		}
		$("#task").replaceWith(parentElement);
		$(`#task-${j}`).css("display", "inline").addClass("active-page");
		if (numberOfPages > 1) {
			$("#pagination").css("visibility", "visible");
		} else {
			this.showTaskPage(1);
			$("#pagination").css("visibility", "hidden");
		}
	}
	showTaskPage(num: number) {
		$(".task-page").css("display", "none").removeClass("active-page");
		$(`#task-${num}`).css("display", "inline").addClass("active-page");
	}
	upTaskPage(): void {
		const numberOfPages = $(".task-page").length;
		let id = parseNumber($(".active-page").attr("page-num") ?? "");
		id++;
		id < 1 || id > numberOfPages ? "" : this.showTaskPage(id);
	}
	downTaskPage(): void {
		const numberOfPages = $(".task-page").length;
		let id = parseNumber($(".active-page").attr("page-num") ?? "");
		id--;
		id < 1 || id > numberOfPages ? "" : this.showTaskPage(id);
	}
	taskNoSplit(): number {
		const a = 0;
		return a;
	}
	removeTask(pid: number) {
		$(`#taskbar [pid="${pid}"]`).remove();
		this.setTaskPosition();
	}
	setTaskActive(pid: number) {
		$("#task span.active-task").removeClass("active-task");
		$(`#task [pid="${pid}"]`).addClass("active-task");
	}
	setTaskInActive(): void {
		$("#task span.active-task").removeClass("active-task");
		//$('#task [pid="' + pid + '"]').addClass('active-task');
	}
	minimizeTask(pid: number) {
		$(`#task [pid="${pid}"]`).removeClass("active-task");
	}

	//------------------------------------------ Dialog Box Functions ---------------------------------------------- //

	static setDialogBox(
		parentId: string,
		title: string,
		type: string,
		errorMessage: string,
	): void {
		let newParentId: any;
		if (parentId.indexOf("#") === 0) {
			newParentId = parentId.slice(1, parentId.length);
		} else {
			newParentId = parentId;
		}
		const dialogData = `<div id="dialog" class="dialog window active-window ui-widget-content"> <div class="window-border"> <div class="title-bar h-count"> <div class="control-box"> <a class="button-3d close-dialog"><span>&nbsp;</span></a> </div> <span class="title"> ${title} </span> </div> <div class="error-content"> <div class="text"> <img class="icon" src="images/win98_icons/exclamation.ico"/> <p>${errorMessage}</p><br> </div> <div class="button"></div> </div> </div>`;
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
	getDesktopPos(): { left1: number; top1: number } | null {
		const $icons = $('.desktop-icon[program-name!="recyclebin"]');
		const iconHeight = 71;
		const iconWidth = 82;
		const { height: containerHeight } = getWindowDimensions();
		const numberFit = Math.floor(containerHeight / (iconHeight + 8));
		let otop: number;
		let oleft: number;
		let indexY = 0;
		let indexX = 0;
		let a: Element | null;
		$icons.each(function (i) {
			otop = parseNumber($(this).css("top") ?? "0");
			oleft = parseNumber($(this).css("left") ?? "0");
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
				if (a?.classList.contains("desktop-icon")) {
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
				if (a?.classList.contains("desktop-icon")) {
					return;
				}
				return false;
			}
			if (indexY > numberFit) {
				indexY = 0;
				indexX++;
			}
		});

		return {
			left1: indexX * iconWidth,
			top1: indexY * iconHeight,
		};
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
	async setDesktop(): Promise<void> {
		const files = await this.getFromLocal();
		if (!files || files.length < 1) return;
		this.iconNumber = 0;
		for (const e of files) {
			let extension: string;
			let img: string;
			let type: string;
			type = e.type;
			const filename = e.filename;
			if (type === "doc" || type === "word") {
				extension = "doc";
				img = "images/win98_icons/WINWORD_2.ico";
			} else if (type === "pdf") {
				extension = type;
				img = "images/win98_icons/pdf.png";
			} else if (type === "txt") {
				extension = type;
				img = "images/win98_icons/notepad_file.ico";
			} else {
				return; // Skip if type is not recognized
			}
			this.iconNumber++;
			const iconData = `<div draggable="true" id="desktop-icon-${this.iconNumber}" class="desktop-icon user-file" data-item="${this.iconNumber}" tabindex="0" fileID="${e.id}" program-name="${e.program}" type="${extension}" style="background:url(${img}) no-repeat center top;background-size: 32px; "><p class="text" style="text-align:center;"><span>${filename}</span></p></div>`;

			$(iconData)
				.appendTo("#desktop-icons")
				.draggable({
					opacity: 0.7,
					delay: 400,
					snap: [71, 82],
					containment: "#desktop",
				});
		}
		setTimeout(() => {
			$("#desktop-icons").setInitialIcons();
		}, 500);
	}
	setNewDesktop(
		fileID: number,
		program: string,
		filename: string,
		type: string,
		shortcut?: boolean,
	): void {
		let extension = type;
		let img = "";
		let stclass = "";
		if (shortcut) {
			stclass = "shortcut";
		}
		const a = this.getDesktopPos();
		if (!a) {
			console.error("Could not get desktop position.");
			return;
		}
		if (type === "doc" || type === "word") {
			extension = "doc";
			img = "images/win98_icons/WINWORD_2.ico";
		} else if (type === "pdf") {
			img = "images/win98_icons/pdf.png";
		} else if (type === "txt") {
			img = "images/win98_icons/notepad_file.ico";
		}
		this.iconNumber++;
		//var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
		const iconData = `<div draggable="true" id="desktop-icon-${this.iconNumber}" class="desktop-icon user-file ${stclass} " data-item="${this.iconNumber}" tabindex="0" fileID="${fileID}" program-name="${program}" type="${extension}" style="background:url(${img}) no-repeat center top;background-size: 32px; top:${a.top1}px; left:${a.left1}px;"><p class="text" style="text-align:center; margin-left:-10px;"><span>${filename}</span></p></div>`;
		$(iconData)
			.appendTo("#desktop-icons")
			.draggable({
				opacity: 0.7,
				delay: 400,
				grid: [64, 64],
				containment: "#desktop",
			});
	}

	// --- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- MS WORD Functions() -- -- -- -- -- -- -- -- -- -- -- -//

	async newWord(fileID?: number): Promise<void> {
		const processID = await this.newProcess();
		const p = await new MsWord(processID, fileID).create();
		this.updateProcess(processID, "msword", p.windowID, p.description);
		//this.access();
		this.setWindowPosition(p.windowID);
		this.appendTask(processID, "msword", p.windowID, p.description);
		this.setActive(processID);
	}
	// Mail Functions(){
	async newMail(fileID?: number): Promise<void> {
		const processID = await this.newProcess();
		const p = await new MailClient(processID).create();
		this.updateProcess(processID, "mail", p.windowID, p.description);
		this.setWindowPosition(p.windowID);
		this.appendTask(processID, "mail", p.windowID, p.description);
		this.setActive(processID);
		if (fileID) {
			this.attachCreate(p.windowID, fileID);
		}
	}

	async newNotepad(fileID?: number): Promise<void> {
		const processID = await this.newProcess();
		const p = await new Notepad(processID, fileID).create();
		this.updateProcess(processID, "notepad", p.windowID, p.description);
		this.setWindowPosition(p.windowID);
		this.appendTask(processID, "notepad", p.windowID, p.description);
		this.setActive(processID);
	}
	sendEmail(windowId: string): void {
		const toEmail = $(`#${windowId} input.sendTo`).val()?.toString().split(",");
		const ccEmail = $(`#${windowId} input.sendToCC`)
			.val()
			?.toString()
			.split(",");
		if (toEmail && toEmail.length > 1) {
			SystemUI.setDialogBox(
				windowId,
				"Email address",
				"1",
				"Please enter only 1 email address to send an email to",
			);
		}
		if (ccEmail && ccEmail.length > 1) {
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
		if (toEmail && toEmail.length > 0) {
			window.open(
				`mailto:${toEmail[0]}?subject=${subject}&body=${body}${ccEmail && ccEmail.length > 0 ? `&cc=${ccEmail[0]}` : ""}`,
			);
		}
	}
	// -- -- --- -- --- -- --- -- -- -- - Context Menu's -- --- -- -- --- -- -- -- -- - -- //
	contextMenuInit(): void {
		const self = this;
		let file: UserFile | undefined;
		let filename: string;
		$.contextMenu({
			className: "desktop-context-menu",
			selector: ".user-file",
			callback: async function (key, opt) {
				const k = key;
				let that = this;
				const fileId = parseNumber($(this).attr("fileid"));
				if (!fileId) return;
				file = await self.getFileFromLocal(fileId);
				if (!file || !file.id) return;

				switch (key) {
					case "open":
						await self.program(opt.$trigger);
						break;
					case "print":
						self.print(file.content, file.filename);
						break;
					case "desktop":
						alert(k);
						break;
					case "mail":
						self.newMail(file.id);
						break;
					case "delete": {
						that = this;
						const fileName = $(opt.$trigger).text();
						const fileType = $(opt.$trigger).attr("type");
						SystemUI.setDialogBox(
							"desktop",
							"Delete File",
							"6",
							`Are you sure you want to permenently delete \'${fileName}.${fileType}\'?`,
						);
						$("#desktop" + " #dialog button").on("click", function () {
							const d = $(this).attr("value");
							if (d === "yes") {
								self.deleteFile(parseNumber($(opt.$trigger).attr("fileid")));
							}
						});
						break;
					}
					case "createShortcut":
						self.setNewDesktop(
							file.id,
							file.program,
							file.filename,
							file.type,
							true,
						);
						break;
					case "properties":
						self.properties(file.id);
						break;
					case "rename": {
						const $children = $(opt.$trigger).children().children();
						$children.attr("contentEditable", "true");
						$children.focus();
						that = this;
						$children.on("blur", function () {
							$(this).removeAttr("contentEditable");
							$(this).removeAttr("autocomplete");
							filename = $(this).text().toString();
							self.rename($(that).attr("fileid") ?? "", filename);
						});
						break;
					}
					default:
						break;
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
			position: (opt) => {
				// The type in the typedef is incomplete, so override
        const newOpt: JQuery & { $menu: JQuery, $trigger: JQuery } = opt as unknown as JQuery & {
					$menu: JQuery;
					$trigger: JQuery;
				};
				const a = $(newOpt.$trigger).offset() || { top: 0, left: 0 };
				if (!a) return;
				// ts-ignore-next-line
				newOpt.$menu.css({
					top: a.top + 10,
					left: a.left - 10,
				});
			},
			className: "word-file-context-menu",
			callback: function (key) {
				const parentId = findNearestId.call(this);
				if (!parentId) return;
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
							self.newMail(parseNumber($(`#${parentId}`).attr("fileid")));
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
						console.warn(`Unknown context menu key: ${key}`);
						break;
				}
			},
			items: {
				new: {
					name: "New",
					accesskey: "O",
					//className: "context-menu-bold",
					icon: (_opt: any, $itemElement: { html: (arg0: string) => void }) => {
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
					icon: (_opt: any, $itemElement: { html: (arg0: string) => void }) => {
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
					icon: (_opt: any, $itemElement: { html: (arg0: string) => void }) => {
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
					icon: (_opt: any, $itemElement: { html: (arg0: string) => void }) => {
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
					icon: (_opt: any, $itemElement: { html: (arg0: string) => void }) => {
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
							icon: (
								_opt: any,
								$itemElement: { html: (arg0: string) => void },
							) => {
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
		//Notepad Context Menu
		$.contextMenu({
			selector: ".notepad .menu-bar .file",
			//appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
			trigger: "left",
			position: (opt) => {
				const newOpt: JQuery & { $menu: JQuery, $trigger: JQuery } = opt as unknown as JQuery & {
					$menu: JQuery;
					$trigger: JQuery;
				};
				const a = $(newOpt.$trigger).offset() || { top: 0, left: 0 };
				newOpt.$menu.css({
					top: a.top + 10,
					left: a.left - 10,
				});
			},
			className: "notepad-file-context-menu",
			callback: function (key) {
				const parentId = findNearestId.call(this);
				if (parentId) {
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
							console.warn(`Unknown context menu key: ${key}`);
							break;
					}
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
