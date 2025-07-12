import { Kernel } from "../kernel";
import { ProgramData } from "../program-data";
import { Application } from './application';

export class Explorer extends Application {
    directory: string;
    constructor(processID, directory) {
        super(processID);
        this.directory = directory;
        const { windowID, description } = this.create();
        this.windowID = windowID;
        this.description = description;
    }
    create() {
        const a = this.append();
        return a;
    }
    append() {
        const e = Kernel.getFileFromLocal('file-0000000000002');
        const iconURL = ProgramData.getIconByType(e.type);
        const iconData = `<div class="folder-icon user-file" tabindex="0" fileID="${e.fileID}" program-name="${e.program}" type="${e.extension}" style="background:url(${iconURL}) no-repeat center top;background-size: 32px; "><p class="text" style="text-align:center;"><span>${e.filename}</span></p></div>`;
        const b = this.getDirectoryContents();
        const explorerData = `<div id="explorer-${this.processID}" class="explorer window ui-widget-content" program-name="explorer" pid="${this.processID}" directory="${this.directory}">
            <div class="window-border">
                <div class="title-bar" id="parent">
                    <div class="control-box">
                        <a class="button-3d minimize"><span>&nbsp;</span></a>
                        <a class="button-3d maximize" state="min"><span>&nbsp;</span></a>
                        <a class="button-3d close"><span>&nbsp;</span></a>
                    </div>
                    <span class="title">
                    ${b.title}
                    </span>
                </div>
                <div class="top">
                    <div class="menu-bar  h-count">
                        <span class="f-sep"></span>
                        <a><span>F</span>ile</a>
                        <a><span>E</span>dit</a>
                        <a><span>V</span>iew</a>
                        <a><span>G</span>o</a>
                        <a>F<span>a</span>vourites</a>
                        <a><span>H</span>elp</a>
                        <div class="clear"></div>
                    </div>
                    <span class="hr-sep"></span>
                    <div class="clear"></div>
                </div>
                <div class="explorer-top-bar">
                    <a class="b-back"></a>
                    <a class="b-forward"></a>
                    <a class="b-up"></a>
                    <span class="sep"></span>
                    <a class="b-cut"></a>
                    <a class="b-copy"></a>
                    <a class="b-paste"></a>
                    <a class="b-undo"></a>
                    <span class="sep"></span>
                    <a class="b-delete"></a>
                    <a class="b-properties"></a>
                </div>
                <div class="header-info">
                    <div class="middle-bar">
                        <p class="to">Address:</p>
                        <input type="text" id="address-bar" value="${b.title}" />
                    </div>
                </div>
                <div id="explorer-content" class="content">
                    <div class="left-side">
                        <div class="explorer-icon"></div>
                        <div class="explorer-header">
                            ${b.title}
                        </div>
                        <div class="underline-header">
                            <!-- <div class="red"></div>
                            <div class="yellow"></div>
                            <div class="green"></div>
                            <div class="blue"></div> -->
                        </div>
                        <br>
                        <div class="sub-header">Select an item to view its description</div>
                    </div>
                    <div class="right-side">
                        <div class="folder-location">
                            <div class="folder-url folder-icon" directory="root" tabindex="0" style="background:url(images/win98_icons/msie2.ico) no-repeat center top;" url="https://github.com/lolstring">
                                <p class="text"><span>Github</span></p>
                            </div>
                            <div class="folder-url folder-icon" directory="root" tabindex="0" style="background:url(images/win98_icons/msie2.ico) no-repeat center top;" url="https://linkedin.com/in/rahmehra">
                                <p class="text"><span>LinkedIn</span></p>
                            </div>
                            <div class="folder-url folder-icon" directory="root" tabindex="0" style="background:url(images/win98_icons/msie2.ico) no-repeat center top;" url="https://youtube.com/user/lolstring909">
                                <p class="text"><span>Youtube</span></p>
                            </div>
                            ${iconData}
                        </div>
                    </div>
                </div>
                <div class="status-bar  h-count" id="status-bar-1">
                    <div class="status-bar-content">
                        <span class="box" style="width:20%">
                    </span>
                         <span class="box size" style="width:50%">
                         
                    </span>
                        <span class="box" style="width:25%">
                        <img class="status-folder-icon" src="images/win98_icons/directory_open.ico"></img>${b.title}
                    </span>
                    </div>
                </div>
            </div>
        </div>`;
        $(explorerData).appendTo('#desktop').show('fast').draggable({
            handle: '.title-bar'
        });
        const a = $(`#explorer-${this.processID} #explorer-content`);
        $(`#explorer-${this.processID}`).resizable({
            alsoResize: a
        });
        return {
            windowID: `#explorer-${this.processID}`,
            description: 'My projects'
        };
    }
    getDirectoryContents() {
        //future
        return {
            title: 'My Projects',
            location: 'Desktop/My Projects',
            type: 'folder'
        }
    }
}