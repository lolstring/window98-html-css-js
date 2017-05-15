//
// //				'fileID': fid,
// 					'filename': filename,
// 					'content': contentDocument,
// 					'type': type,
// 					'program': program,
// 					'creationDate': Date.now(),
// 					'modifiedDate': Date.now(),
// -- -- -- -- Global Functions -- -- -- -- //
function completeArr(arr) {
    let number = 0;
    var isComplete = false;
    loop1:
        for (var i = 1; i < arr.length; i++) {
            loop2: for (let j = 1 + arr[i - 1]; j < arr[i]; j++) {

                number = j;
                if (number > 0) {
                    break loop1;
                }
            }
        }
    if (number == 0 || !(Number.isInteger(number))) {
        isComplete = true;
        return incrementArr(arr);
    } else {
        isComplete = false;
        arr.push(number);
        arr.sort();
        return number;
    }
}

function incrementArr(arr) {
    return arr[arr.length] = arr.length + 1;
}

function removeArr(arr, v) {
    var index = arr.indexOf(v);
    Array.isArray(arr);
    if (index > -1) {
        arr.splice(index, 1);
        return true;
    }
}


var toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    //Clock//

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    var suffix = h >= 12 ? "PM" : "AM";
    h = ((h + 11) % 12 + 1);
    $('#clock .text').html(h + ':' + m + ' ' + suffix);
    var t = setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

//Universal Logger
function log(e) {
    console.log(e);
}

// // -- -- -- -- Add Image to contentEditable -- -- -- -- //

// // Add the paste event listener
// window.addEventListener("paste", pasteHandler);

// /* Handle paste events */
// function pasteHandler(e) {
// 	console.log(e);
//    // We need to check if event.clipboardData is supported (Chrome)
//    if (e.clipboardData) {
//       // Get the items from the clipboard
//       var items = e.clipboardData.items;
//       if (items) {
//          // Loop through all items, looking for any kind of image
//          for (var i = 0; i < items.length; i++) {
//             if (items[i].type.indexOf("image") !== -1) {
//                // We need to represent the image as a file,
//                var blob = items[i].getAsFile();
//                // and use a URL or webkitURL (whichever is available to the browser)
//                // to create a temporary URL to the object
//                var URLObj = window.URL || window.webkitURL;
//                var source = URLObj.createObjectURL(blob);

//                // The URL can then be used as the source of an image
//                createImage(source);
//             }
//          }
//       }
//    // If we can't handle clipboard data directly (Firefox), 
//    // we need to read what was pasted from the contenteditable element
//    } else {
//       // This is a cheap trick to make sure we read the data
//       // AFTER it has been inserted.
//       setTimeout(checkInput, 1);
//    }
// }

// /* Parse the input in the paste catcher element */

// /* Creates a new image from a given source */
// function createImage(source) {
//    var pastedImage = new Image();
//    pastedImage.onload = function() {
//       // You now have the image!
//    }
//    pastedImage.src = source;
// }

// -- -- -- -- PolyFill -- -- -- -- //



// -- -- -- -- Extended Prototype -- -- -- -- //


/*
Check if an element exists in array using a comparer 
function comparer : function(currentElement)
*/
Array.prototype.inArray = function(comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};
/* 
Adds an element to the array if 
it does not already exist using a comparer function
*/
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
        this.sort();
    }
};
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


// -- -- -- -- jQuery Extended Functions -- -- -- -- //

jQuery.cachedScript = function(url, options) {

    // Allow user to set any option except for dataType, cache, and urlp
    options = $.extend(options || {}, {
        dataType: "script",
        cache: false,
        url: url
    });

    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax(options);
};
/*!
    tap / double tap special event for jQuery
    v 1.0.0
    (c) 2014 Yair Even Or <http://dropthebit.com>
    MIT-style license.
*/
/*!
    tap / double tap special event for jQuery
    v 1.0.0
    (c) 2014 Yair Even Or <http://dropthebit.com>
    MIT-style license.
*/



// ;
// (function($) {
//     "use strict";

//     var tapTimer,
//         moved = false, // flag to know if the finger had moved while touched the device
//         threshold = 250; // ms

//     //////////////////////
//     // special events

//     $.event.special.doubleTap = {
//         setup: setup,
//         teardown: teardown,
//         handler: handler
//     };

//     $.event.special.tap = {
//         setup: setup,
//         teardown: teardown,
//         handler: handler
//     };

//     //////////////////////
//     // events methods

//     function setup(data, namespaces) {
//         var elm = $(this);

//         if (elm.data('tap_event') == true)
//             return;

//         elm.bind('touchend.tap', handler)
//             .bind('touchmove.tap', function() {
//                 moved = true;
//             }).data('tap_event', true);
//     }

//     function teardown(namespaces) {
//         $(this).unbind('touchend.tap touchmove.tap');
//     }

//     function handler(event) {
//         if (moved) { // reset
//             moved = false;
//             return false;
//         }

//         var elem = event.target,
//             $elem = $(elem),
//             lastTouch = $elem.data('lastTouch') || 0,
//             now = event.timeStamp,
//             delta = now - lastTouch;

//         // double-tap condition
//         if (delta > 20 && delta < threshold) {
//             clearTimeout(tapTimer);
//             return $elem.data('lastTouch', 0).trigger('doubleTap');
//         } else
//             $elem.data('lastTouch', now);


//         tapTimer = setTimeout(function() {
//             $elem.trigger('tap');
//         }, threshold);
//     }

// })(jQuery);


/**
 * jQuery Plugin to add basic "swipe" support on touch-enabled devices
 *
 * @author Yair Even Or
 * @version 1.0.0 (March 20, 2013)
 */
// (function($) {
//     "use strict";

//     $.event.special.swipe = {
//         setup: function() {
//             $(this).bind('touchstart', $.event.special.swipe.handler);
//         },

//         teardown: function() {
//             $(this).unbind('touchstart', $.event.special.swipe.handler);
//         },

//         handler: function(event) {
//             var args = [].slice.call(arguments, 1), // clone arguments array, remove original event from cloned array
//                 touches = event.originalEvent.touches,
//                 startX, startY,
//                 deltaX = 0,
//                 deltaY = 0,
//                 that = this;

//             event = $.event.fix(event);

//             if (touches.length == 1) {
//                 startX = touches[0].pageX;
//                 startY = touches[0].pageY;
//                 this.addEventListener('touchmove', onTouchMove, false);
//             }

//             function cancelTouch() {
//                 that.removeEventListener('touchmove', onTouchMove);
//                 startX = startY = null;
//             }

//             function onTouchMove(e) {
//                 //e.preventDefault();

//                 var Dx = startX - e.touches[0].pageX,
//                     Dy = startY - e.touches[0].pageY;

//                 if (Math.abs(Dx) >= 50) {
//                     cancelTouch();
//                     deltaX = (Dx > 0) ? -1 : 1;
//                 } else if (Math.abs(Dy) >= 20) {
//                     cancelTouch();
//                     deltaY = (Dy > 0) ? 1 : -1;
//                 }

//                 event.type = 'swipe';
//                 args.unshift(event, deltaX, deltaY); // add back the new event to the front of the arguments with the delatas
//                 return ($.event.dispatch || $.event.handle).apply(that, args);
//             }
//         }
//     };
// })(jQuery);

$.fn.setInitialIcons = function(options) {

    options = $.extend({
        selector: '.desktop-icon[program-name!="recyclebin"]',
        marginTop: 26,
        marginLeft: 0
    }, options);

    return this.each(function() {

        var $container = $(this),
            $icons = $(options.selector, $container),
            containerHeight = $(window).height(),
            iconHeight = $($icons[0]).height(),
            iconWidth = $($icons[0]).width(),
            numberFit = Math.floor(containerHeight / (iconHeight + options.marginTop)),
            top = 0,
            left = 0;
        $icons.each(function(i) {
            if (i % numberFit == 0 && i > 0) {
                top = 0;
                left += iconWidth + options.marginLeft + 4;
            } else {
                top = top;
            }
            $(this).css({
                top: top,
                left: left + options.marginLeft
            });
            top += iconHeight + options.marginTop;
        });
    });
};

function l(e) {
    console.log(e)
}
// -- -- -- -- jQuery Options -- -- -- -- //


// $.event.special.tap.emitTapOnTaphold = false;


// -- -- -- -- Constants -- -- -- -- //


// -- -- -- -- Global Program Data -- -- -- --//
var programData = {
    getIcon: function(program) {
        var ICON_PATH = '../images/win98_icons/'
        switch (program) {
            case "msword":
                return ICON_PATH + 'WINWORD_2.ico';
            case "notepad":
                return ICON_PATH + 'notepad_file.ico';
            case "mail":
                return ICON_PATH + 'mail.ico';
            case "minesweeper":
                return ICON_PATH + 'minesweeper.ico';
            case "winamp":
                return ICON_PATH + 'winamp.ico';
            case "wolf-3d":
                return ICON_PATH + 'wolf3d.ico';
            case "iexplorer":
                return ICON_PATH + 'msie2.ico';
            case "explorer":
                return ICON_PATH + 'hard_disk_drive.ico';
            default:
                console.log('Don\'t have icon for this program');
                return ICON_PATH + 'msie2.ico';
        }
    },
    getIconByType: function(program) {
        var ICON_PATH = '../images/win98_icons/'
        switch (program) {
            case "word":
            case "doc":
                return ICON_PATH + 'WINWORD_2.ico';
            case "text":
            case "txt":
                return ICON_PATH + 'notepad_file.ico';
            case "pdf":
                return ICON_PATH + 'pdf.png';

            default:
                console.log('Don\'t have icon for this program');
        }
    }
}

var zIndex = 100;

class kernel {
    constructor() {
        this.init();
    }
    init() {}
    store() {
        if (Modernizr.localstorage) {
            localStorage.setItem('processes', '');
            //localStorage.setItem('user', '');
            //localStorage.setItem('userData', '');
            localStorage.setItem('recycleBin', '');
            localStorage.setItem('Kernel Log', '');
            //localStorage.removeItem(processID);
            //localStorage.removeItem(docNumber);
            localStorage.setItem('processID', '[]');
            localStorage.setItem('docNumber', '[]');
        } else {
            log('No Storage');
        }
    }
    vfsInit() {
        var a = localStorage.getItem('fileSystem');
        a ? this.vfsSetup() : this.vfsInit(a);
    }
    vfsSetup() {
        var fileSystem = {

        }
    }
    static getFileFromLocal(fileID) {
        var contentDocument;
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        for (var i = 0; i < localData.files.length; i++) {
            if (fileID === localData.files[i].fileID) {
                contentDocument = localData.files[i];
                break;
            }
        }
        return contentDocument;
    }
}
/**
 *	Process extends kernel WHy ?? 
 *	Generates processID.
 *	Adds process to list.
 *	removes process from list and destroys the process - removes process.
 *	logProcess - Adds it to the store.
 *	setState - Sets process state.
 *	a lot of sub functions.
 * 	
 */
class process {
    /** @return {nothing} */
    constructor() {}
        /**
         * @param  program {string}
         * @param  windowID {string/unique}
         * @param  description {string}
         * @return {processID}
         */
    newProcess() {
            //console.log(typeof processesID);
            var processID = this.processIDStore();
            return processID;
            // else {
            // 	super.Error('addProcess');
            // }
        }
        /**
         * Retrieve LocalStorage Process ID 
         * Increament
         * Store Back.
         *
         * @return {processNumber}
         */
    processIDStore() {
            var num = JSON.parse(localStorage.getItem('processID'));
            var processNumber = completeArr(num);
            localStorage.setItem('processID', JSON.stringify(num));
            return processNumber;

        }
        /**
         * Retrieve LocalStorage process ID
         * REMOVE from arr
         * Store back into Local
         *
         * 
         * @param  {Value to Remove}
         * @return {true/false}
         */
    processIDRemove(v) {
            v = parseInt(v);
            var num = JSON.parse(localStorage.getItem('processID'));
            var processNumber = removeArr(num, v);
            localStorage.setItem('processID', JSON.stringify(num));
            return true;
        }
        /**
         * @param {process}
         * @param {program}
         * @param {windowID}
         * @param {description}
         * return true/false if added successfully.
         */
    addProcess(processID, program, windowID, description) {
        //console.log(processID);
    }
    removeProcess(processID) {
        //console.log(processID);
    }
    setStorage() {
        //console.log('lol');
    }
    setProcessActive(processID) {
        //console.log('set process active yolo');
    }
    setProcessInActive(processID) {
        //console.log('set process InActive yolo');
    }
    static remove(processID) {

    }
}
/** 
 * Window Manager. Controls SystemUI including sound. Extends Kernel;
 * Has Dialog Box Functionality.
 * Has Event Listeners
 * Prorbably taskbar.
 *
 */
class SystemUI extends process {
    constructor() {
        super();
        //this.init();
        //this.sound = new sound();
        //this.eventListeners();
        //this.windowInitalPositionValues();
        //this.a=0;
    }
    init() {
        this.windowInitalPositionValues();
        this.contextMenuInit();
        this.runInit();

    }
    eventListeners() {
            /**
             * Desktop Icons
             */
            var self = this;
            //----------------------------------------------- DESKTOP ICON EVENT LISTENERS -----------------------------------------//
            $("#desktop").on('focus click', '.desktop-icon', function() {
                if ($(this).hasClass('disabled'))
                    return 0;
                $('.desktop-icon').children().removeClass('active');
                $(this).children().addClass('active');
            });
            $("#desktop").on('focusout', '.desktop-icon', function() {
                if ($(this).hasClass('disabled'))
                    return 0;
                $('.desktop-icon').children().removeClass('active');
            });
            $("#desktop").on('dblclick touchend', '.desktop-icon', function(e) {
                if ($(this).hasClass('disabled'))
                    return 0;
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

            $("#desktop").on('click', '.minimize', function() {
                var pid = $(this).closest('[pid]').attr('pid');
                self.minimize(pid);
            });
            /**
             * Universal Window Minimize
             * 
             * @param  {window}
             * @return {nothing}
             */
            $('#desktop').on('click', '.maximize', function() {
                //$('#desktop').trigger('beforeMinimize');
                var pid = $(this).closest('[pid]').attr('pid');
                self.maximize(pid);
            });

            /**
             * Universal Window Close
             * 	
             * @param  {window}
             * @return {nothing}
             */
            $("#desktop").on('click', '.close', function() {
                self.close(this);
                $(this).css('pointer-events', 'auto');
            });
            /*
            	Universal set active.
             */

            $('#desktop').on('mousedown', '.window', function(e) {
                e.stopPropagation();

                //e.preventDefault();
                if (!(e.currentTarget.id === "dialog")) {
                    self.setActive($(this).attr('pid'));
                }
            });

            $("#desktop").on("resizestop", '.window', function(event, ui) {
                $(this).data({
                    originalTop: ui.position.top,
                    originalLeft: ui.position.left,
                    originalDisplay: $(this).css('display'),
                    originalPosition: $(this).css('position'),
                    originalHeight: ui.size.height,
                    originalWidth: ui.size.width,
                    originalOpacity: $(this).css('opacity')
                });
            });
            $("#desktop").on('dblclick', '.ui-resizable > div.window-border > .title-bar > .title', function() {
                var pid = $(this).closest('[pid]').attr('pid');
                self.maximize(pid);
            });

            // ------------------------------------------------ msword events(So Event's are not init everytime new word) -----------------------------------------------//

            $("#desktop").on('click', '.b-new', function(e) {
                self.newWord()
            });
            $("#desktop").on('click', '.b-save', function(e) {
                e.preventDefault();
                var parentId = $(this).closest('[id]').attr('id');
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
            $("#desktop").on('click', '.b-open', function(e) {
                e.preventDefault();
                var parentId = $(this).closest('[id]').attr('id');
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
            $("#desktop").on('click', '.b-print', function() {
                var parentId = $(this).closest('[id]').attr('id');
                self.printFile(parentId);
            });
            //------------------------------------------------ Mail Events -------------------------------------------------------//

            $("#desktop").on('click', '.b-attach', function(e) {
                e.preventDefault();
                var parentId = $(this).closest('[id]').attr('id');
                var attachSel = '#' + parentId + ' #attach';
                $(attachSel).css('display', 'block');
                // .draggable({
                // 	handle: '.title-bar'
                // });
                self.updateContentBox(attachSel);
                var offset = $(attachSel).offset();
                $(attachSel).css({
                    "top": offset.top,
                    "left": offset.left,
                    "position": "fixed"
                });
                $('#' + parentId).closest('[id]').css('pointer-events', 'none');
                $(attachSel).css('pointer-events', 'auto');
            });
            $('#desktop').on('click', '.attachment .cancel', function() {
                $(this).parent().remove();
            });
            $('#desktop').on('click', '.b-send', function(e) {
                e.preventDefault();
                self.sendEmail($(this).closest('[id]').attr('id'));
            });
            //------------------------------------------------- RUN EVENTS -------------------------------------------------//
            $('#menu-8').on('click', function() {
                $('#run').draggable({
                    handle: '.title-bar'
                });
                self.setActive($('#run').attr('pid'));
            });
            $('#run .ok-button').on('click', function() {
                if ($(this).val() === 'ok') {
                    self.runProgram($('#run input').val());
                } else {
                    $('#run').css('display', 'none');
                }
            });
            $('#run .close-run,#run .close-button').on('click', function() {
                var pid = $(this).closest('[pid]').attr('pid');
                self.beforeWindow(pid, function() {
                    self.programMinimize(pid);
                })
            });
            //------------------------------------------------ Explorer Events ----------------------------------------//
            $("#desktop").on('focus click', '.folder-icon', function() {
                 if($(this).hasClass('folder-url')) return;
                $('.folder-icon').children().removeClass('active');
                $(this).children().addClass('active');
                //setting file size
                var p1 = $(this).closest('[pid]').attr('id');
                var file = kernel.getFileFromLocal($(this).attr('fileid'));
                var size = Math.round(((JSON.stringify(file)).length * 2)/1024);
                $('#' + p1 + ' .box.size').text(size + ' KB');
            });
            $("#desktop").on('focusout', '.folder-icon', function() {
                 if($(this).hasClass('folder-url')) return;
                $('.folder-icon').children().removeClass('active');
                var p1 = $(this).closest('[pid]').attr('id');
                $('#' + p1 + ' .box.size').text('');
            });
            $("#desktop").on('dblclick touch','.folder-icon',function(e){
                e.preventDefault();
                e.stopPropagation();
                if($(this).hasClass('folder-url')) return;
                self.program(this);
            });
            $('#desktop').on('dblclick touch','.folder-url',function(e){
                e.preventDefault();
                e.stopPropagation();

                window.open($(this).attr('url'));
            })
            //------------------------------------------------ Properties Events --------------------------------------//
            $('#desktop').on('click', '.properties .button', function(e) {
                    var parentID = $(this).closest('[id]').attr('id');
                    $('#' + parentID + ' .close').trigger('click');
                })
                //----------------------------------------------- Menu Events ----------------------------------------------------//
            $('#menu-10').on('click', function() {
                self.shutdown();
            })
            $('#menu-9').off().on('click', function() {
                self.beforeLogoff();
            });
            $('.sub-menu-item').on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    self.program(this);
                })
                //----------------------------------------------- SAVE/OPEN/ATTACH WINDOW EVENTS -----------------------------------------//
                /**
                 * Save/Open Window Close
                 * 	
                 * @param  {window}
                 * @return {nothing}
                 */
            $("#desktop").on('click', '.close-save,	.cancel-button', function() {
                var parentId = $(this).closest('[id]').attr('id');
                var fatherId = $(this).closest('[id]').parent().closest('[id]').attr('id');

                $('#' + fatherId + ' #' + parentId).css('display', 'none');
                $('#' + fatherId).css('pointer-events', 'auto');
            });

            $("#desktop").on('click', '.save-button', function() {
                self.save(this);
            });
            $('#desktop').on('click', '.desktop-ico', function() {

                $(this).siblings('#save-location').val('desktop');
            });
            $("#desktop").on('click', '.open-button', function() {
                self.open(this);
            });
            $('#desktop').on('click', '.attach-button', function() {
                self.attach(this);

            })
            var lol;
            $("#desktop").on('click', '.user-file-list', function(e) {
                //$('.user-file-list').children().css('background', 'none');
                var a = $(this).children().text();
                var lol = $(this).attr('type');
                var file = $(this).attr('fileid');
                var windowType = $(this).closest('[id]').attr('id');
                if (e.shiftKey) {
                    if (windowType == "attach") {
                        $(this).addClass('selected');
                        var oldVal = $(this).closest('[id]').find('.fileID').val();
                        var oldVal1 = $(this).closest('[id]').find('.filename').val();
                        if (oldVal1.indexOf('"') < 0) oldVal1 = '"' + oldVal1 + '"';
                        //var oldVal2 = $(this).closest('[id]').find('#file-type').val();
                        $(this).closest('[id]').find('.filename').val(oldVal1 + ' "' + a + '" ');
                        $(this).closest('[id]').find('.fileID').val(oldVal + '|' + file);
                        $(this).closest('[id]').find('#file-type').val('none');
                    } else {
                        $('.user-file-list').removeClass('selected');
                        $(this).closest('[id]').find('.filename').val(a);
                        $(this).closest('[id]').find('#file-type').val(lol);
                        $(this).closest('[id]').find('.fileID').val(file);
                    }
                } else {
                    $('.user-file-list').removeClass('selected');
                    $(this).toggleClass('selected');
                    $(this).closest('[id]').find('.filename').val(a);
                    $(this).closest('[id]').find('#file-type').val(lol);
                    $(this).closest('[id]').find('.fileID').val(file);
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
            $("#desktop").on('blur', '.user-file-list', function() {
                //$('.user-file-list').children().css('background', 'none');
            });

            //----------------------------------------------- DIALOG WINDOW EVENTS -----------------------------------------//
            $("#dialog button").on('click', function() {});

            //----------------------------------------------- TaskBar Events ----------------------------------------------//		//
            $("#menu-2").hover(
                function() {
                    $("#sub-menu-2").css("display", "block");

                },
                function() {
                    $("#sub-menu-2").hover(function() {
                        $("#sub-menu-2").css("display", "block");
                    }, function() {
                        $("#sub-menu-2").css("display", "none");
                    });
                }
            )
            $(document).mouseup(function(e) {
                var container = $("#start-menu");

                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    container.slideUp();
                    //container.css("z-index", "400000");
                    $("#sub-menu-2").css("display", "none");
                }
            });
            $('#start-menu').on('click', function() {
                    if ($("#start-menu").css("display") == "block") {
                        $("#start-menu").slideUp();
                    } else {
                        $("#start-menu").slideDown();
                    }
                })
                //Test
            $(document).on('click', '#start-button', function() {
                if ($("#start-menu").css("display") == "block") {
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
                function() {
                    $("#sub-menu-2").css("display", "block");
                },
                function() {
                    $("#sub-menu-2").hover(function() {
                        $("#sub-menu-2").css("display", "block");
                    }, function() {
                        $("#sub-menu-2").css("display", "none");
                    });
                }
            );
            $('#desktop').on('click', '.window-open', function(e) {
                e.preventDefault();
                var that = this;
                var pid = $(that).attr('pid');
                //console.log('lol' + $(this).attr('id').replace('task-', ''));
                if (!($('.window[pid="' + pid + '"]').is(':animated'))) {
                    if ($(that).hasClass('active-task')) {
                        self.setInActive(pid);
                    } else {
                        self.setActive(pid);
                    }
                } else {
                    setTimeout(function() {
                        if ($(that).hasClass('active-task')) {
                            self.setInActive(pid);
                        } else {
                            self.setActive(pid);
                        }
                    }, 800);
                }
            });
            $('#taskbar .show-desktop').on('click', function() {
                $('.window').each(function() {
                    if ($(this)[0].hasAttribute("pid")) {
                        self.minimize($(this).attr('pid'));
                    };
                })
            });
            $('#taskbar .new-mail').on('click', function() {
                self.newMail();
            });
            $('#pageup').on('click', function() {
                self.upTaskPage();
            });
            $('#pagedown').on('click', function() {
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
        var selector = $(iconSelector);
        var program = selector.attr('program-name');
        var fileID = selector.attr('fileid');
        var processID = this.isOpen(fileID);
        var p;
        if (processID != null || typeof processID != "undefined") {
            // console.log('processID' + processID);
            this.setActive(processID);
        } else {
            var processID = super.newProcess();
            switch (program) {
                case "msword":
                    var p = new MsWord(processID, fileID);
                    if (this.botOpen === false) {
                        globalBot.agent(function(a) {
                            a.moveTo($(window).width() * 0.75, $(window).height() * 0.75);
                            a.speak('This is Microsoft Word. You can edit files and save them to the desktop which is internally stored to Local Storage. Be careful when you clear cache. You can also download the file to your own computer.')
                        });
                        this.botWord = true;
                    }
                    break;
                case "notepad":
                    var p = new Notepad(processID, fileID);
                    break;
                case "mail":
                    globalBot.agent(function(a) {
                        a.moveTo($(window).width() * 0.75, $(window).height() * 0.75);
                        a.speak('Welcome to the mail client. You can compose emails here. If you want to get in touch with me contact me on rahulmehra@techgeek.co.in.');
                    });
                    var p = new MailClient(processID);
                    break;
                case "wolf-3d":
                    var a = this.isRunning(program);
                    if (!a) {
                        var p = new Wolf3d(processID);
                    } else {
                        this.setActive(a);
                    }
                    break;
                case "minesweeper":
                    var a = this.isRunning(program);
                    if (!a) {
                        var p = new Minesweeper(processID);
                    } else {
                        this.setActive(a);
                    }
                    break;
                case "winamp":
                    var a = this.isRunning(program);
                    if (!a) {
                        var p = new Winamp(processID);
                    } else {
                        this.setActive(a);
                    }
                    break;
                case "recyclebin":
                    this.beforeLogoff(true);
                    break;
                case "explorer":
                    var p = new Explorer(processID,selector.attr('directory'));
                    break;
            }
            if (p) {
                super.addProcess(processID, program, p.windowID, p.description);
                this.setWindowPosition(p.windowID);
                this.appendTask(processID, program, p.windowID, p.description);
                this.setActive(processID);
            } else {
                console.log('No Process Returned');
            }
        }
    }
    isOpen(fileID) {
        var processID, wfileID;
        // if ($('.window[fileid="' + fileID + '"]').length != 0) {
        //     processID = $('.window[fileid="' + fileID + '"]').attr('pid');
        // }
        // return processID;
        $('.window').each(function() {
            var $w = $(this);
            wfileID = $w.attr('fileid');
            if (fileID === wfileID) {
                processID = $w.attr('pid');
                return false;
            }
        });
        return processID
    }
    isRunning(program) {
        var a = false;
        if ($('.window[program-name="' + program + '"]').length != 0) {
            a = $('.window[program-name="' + program + '"]').attr('pid');
        }
        // $('.window').each(function(){
        // 	if($(this).attr('program-name')===program){
        // 		a = $(this).attr('pid');
        // 	}
        // })
        return a;
    }
    close(closeButton) {
        var self = this;
        var windowID = $(closeButton).closest('[pid]').attr('id');
        windowID = '#' + windowID;
        var id = $(windowID).attr('id');
        var pid = $(windowID).attr('pid');
        var program = $(windowID).attr('program-name');
        switch (program) {
            case "msword":
                MsWord.remove($(windowID).attr('document-number'), function(close) {
                    self.programClose(pid, close);
                });
                break;
            default:
                self.programClose(pid, true);
        }

    }
    properties(fileID) {
        var processID = super.newProcess();
        this.newProperties(processID, fileID);
    }
    newProperties(processID, fileID) {
        var file = this.getFileFromLocal(fileID);
        var size = (JSON.stringify(file)).length * 2;
        var cdate = new Date(file.creationDate);
        //var created = cdate.getDay() + ', ' + cdate.getMonth() + cdate.getDate() +', '+ cdate.getFullYear() +' '+ cdate.getHours() +':'+cdate.getMinutes()+':'+cdate.getSeconds()+' ';
        var created = cdate.toDateString() + ', ' + cdate.toLocaleTimeString();
        var mdate = new Date(file.modifiedDate);
        //var modified = mdate.getDay() + ', ' + mdate.getMonth() + mdate.getDate() +', '+ mdate.getFullYear() +' '+ mdate.getHours() +':'+mdate.getMinutes()+':'+mdate.getSeconds()+' '+mdate.getHours() >= 12 ? 'PM' : 'AM'; 
        var modified = mdate.toDateString() + ', ' + mdate.toLocaleTimeString();
        var iconURL = programData.getIconByType(file.type);
        var propertiesData = `<div id="properties-${processID}" class="properties window ui-widget-content" program-name="properties" pid="${processID}">
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
        $(propertiesData).appendTo('#desktop').show('fast').draggable({
            handle: '.title-bar'
        });
        var off = $('.desktop-icon[fileid="' + file.fileID + '"]').offset();
        off.top = off.top >= $(window).height() / 2 ? $(window).height() / 2 - 32 : off.top;
        $('#properties-' + processID).css({
            'top': off.top + 32,
            'left': off.left + 32
        });
        this.setActive(processID);
    }
    maximize(pid) {
        var self = this;
        var windowID = $('.window[pid="' + pid + '"]').attr('id');
        if ($('#' + windowID).hasClass('wolf')) return;
        var height = $(window).height() - 22;
        var s = $('.window[pid="' + pid + '"]').find('.maximize').attr("state");
        if (s === "min") {
            self.beforeWindow(pid, function() {
                if (!($('.window[pid="' + pid + '"]').is(':animated'))) {
                    $('.window[pid="' + pid + '"]').animate({
                        opacity: 1,
                        top: 0,
                        left: 0,
                        height: height + 'px',
                        width: $(window).width()
                    });
                    $('.window[pid="' + pid + '"]').find('.maximize').attr('state', 'max');
                    if ($('#' + windowID).hasClass('word')) {
                        var docHeight = height - (($('#' + windowID + ' .toolbar').outerHeight() * 3) + 60 + $('#' + windowID + ' .status-bar').outerHeight() + $('.title').outerHeight());
                        $('#' + windowID + ' .document-content').animate({
                            height: docHeight + 'px'
                        })
                    } else if ($('#' + windowID).hasClass('mail')) {
                        var docHeight = height - 246;
                        $('#' + windowID + ' .mail-content').animate({
                            height: docHeight + 'px'
                        })
                    } else if ($('#' + windowID).hasClass('notepad')) {
                        var docHeight = height - 74;
                        $('#' + windowID + ' .document-content').animate({
                            height: docHeight + 'px'
                        })
                    } else if ($('#' + windowID).hasClass('explorer')) {
                        var docHeight = height -152;
                        $('#' + windowID + ' #explorer-content').animate({
                            height: docHeight + 'px'
                        })
                    }
                    $('.window[pid="' + pid + '"]').find('.maximize').css('background-image', 'url(../images/window/max.png)');
                    $('.window[pid="' + pid + '"]').draggable('disable').resizable('disable');
                };
            });
        } else if (s === "max") {
            var windowData = $('.window[pid="' + pid + '"]').data();
            if (!($('.window[pid="' + pid + '"]').is(':animated'))) {
                $('.window[pid="' + pid + '"]').animate({
                    opacity: 1,
                    top: windowData.originalTop,
                    left: windowData.originalLeft,
                    width: windowData.originalWidth + 'px',
                    height: windowData.originalHeight + 'px'
                });
                if ($('#' + windowID).hasClass('word')) {
                    var docHeight = windowData.originalContentHeight;
                    $('#' + windowID + ' .document-content').animate({
                        height: docHeight + 'px'
                    })
                } else if ($('#' + windowID).hasClass('mail')) {
                    var docHeight = windowData.originalContentHeight;
                    $('#' + windowID + ' .mail-content').animate({
                        height: docHeight + 'px'
                    })
                } else if ($('#' + windowID).hasClass('notepad')) {
                    var docHeight = windowData.originalContentHeight;
                    $('#' + windowID + ' .document-content').animate({
                        height: docHeight + 'px'
                    })
                } else if ($('#' + windowID).hasClass('explorer')) {
                    var docHeight = windowData.originalContentHeight;
                    $('#' + windowID + ' #explorer-content').animate({
                        height: docHeight + 'px'
                    })
                }

                $('.window[pid="' + pid + '"]').find('.maximize').attr('state', 'min');
                $('.window[pid="' + pid + '"]').find('.maximize').css('background-image', 'url(../images/clippy/window/maximize.png)');
                $('.window[pid="' + pid + '"]').draggable('enable').resizable('enable');
            }
        };
    }
    minimize(pid) {
            var self = this;
            var windowID = $('.window[pid="' + pid + '"]').attr('id');
            windowID = '#' + windowID;
            //var pid = $(windowID).attr('pid');
            var state = $('.window[pid="' + pid + '"]').find('.maximize').attr('state');
            if (state === "max") {
                self.programMinimize(pid);
            } else if (state === "min") {
                this.beforeWindow(pid, function() {
                    self.programMinimize(pid);
                })
            }
        }
        //top: 54.3px; left: 634.333px; height: 305.58px; width: 939.5px; z-index: 102; display: block;
    beforeWindow(pid, callback) {
        $('.window[pid="' + pid + '"').promise().done(function() {
            var $windowID = $('.window[pid="' + pid + '"]');
            var originalOffset = $windowID.offset();
            var originalTop = originalOffset.top;
            var originalLeft = originalOffset.left;
            var originalPosition = $windowID.css('position');
            var originalHeight = $windowID.outerHeight();
            var originalWidth = $windowID.outerWidth();
            var originalDisplay = $windowID.css('display');
            var originalOpacity = $windowID.css('opacity');
            var originalContentHeight = 0;
            if ($('.window[pid="' + pid + '"]').hasClass('word')) {
                originalContentHeight = $windowID.find('.document-content').outerHeight();
            } else if ($('.window[pid="' + pid + '"]').hasClass('mail')) {
                originalContentHeight = $windowID.find('.mail-content').height();
            } else if ($('.window[pid="' + pid + '"]').hasClass('notepad')) {
                originalContentHeight = $windowID.find('.document-wrap').outerHeight();
            } else if ($('.window[pid="' + pid + '"]').hasClass('explorer')) {
                originalContentHeight = $windowID.find('#explorer-content').outerHeight();
            }

            $windowID.data({
                originalTop: originalTop,
                originalLeft: originalLeft,
                originalDisplay: originalDisplay,
                originalPosition: originalPosition,
                originalHeight: originalHeight,
                originalWidth: originalWidth,
                originalOpacity: originalOpacity,
                originalContentHeight: originalContentHeight
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
        var pid = $(windowId);
        if ($(windowId).hasClass('winamp')) return;
        var offset = pid.offset();
        this.top1 = offset.top + this.topVal;
        this.topVal = this.topVal + this.offsetpx;
        this.left1 = offset.left + this.leftVal;
        this.leftVal = this.leftVal + this.offsetpx;
        pid.offset({
            top: this.top1,
            left: this.left1
        });
        $(windowId).height(this.h * 0.60);
        //	$(windowId).width(this.w * 0.60);
        $(windowId + ' .document-content').height(this.h * 0.60);
        //$(windowId + ' .document-content').width(this.w * 0.50);
        $(windowId + ' .mail-content').height((this.h * 0.60) - 246);
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
        var windowData;
        var $pid = $('.window[pid="' + pid + '"]')
        var state = $pid.find('.maximize').attr('state');
        if (!($('.window[pid="' + pid + '"]').is(':animated'))) {
            if ($pid.css('opacity') === "0") {
                if (state === "max") {
                    var height = $(window).height() - ($('#taskbar').outerHeight());
                    this.ani1 = $('.window[pid="' + pid + '"]').animate({
                        opacity: 1,
                        top: 0,
                        left: 0,
                        height: height + 'px',
                        width: $(window).width()
                    });
                    if ($('.window[pid="' + pid + '"]').hasClass('word')) {
                        var docHeight = height - (($('.window[pid="' + pid + '"] .toolbar').outerHeight() * 3) + 48 + $('.window[pid="' + pid + '"] .status-bar').outerHeight() + $('.title').outerHeight());
                        $('.window[pid="' + pid + '"] .document-content').animate({
                            height: docHeight
                        })
                    } else if ($('.window[pid="' + pid + '"]').hasClass('mail')) {
                        var docHeight = height - 246
                        $('.window[pid="' + pid + '"] .mail-content').animate({
                            height: docHeight
                        })
                    } else if ($('.window[pid="' + pid + '"]').hasClass('mail')) {
                        var docHeight = height - 150
                        $('.window[pid="' + pid + '"] .explorer-content').animate({
                            height: docHeight
                        })
                    }


                } else if (state === "min") {
                    //console.log('min');
                    windowData = $pid.data();
                    $pid.animate({
                        opacity: 1,
                        top: windowData.originalTop,
                        left: windowData.originalLeft,
                        width: windowData.originalWidth + 'px',
                        height: windowData.orignalHeight + 'px'
                    })
                    if ($('.window[pid="' + pid + '"]').hasClass('word')) {
                        var docHeight = windowData.originalContentHeight
                        $('.window[pid="' + pid + '"] .document-content').animate({
                            height: docHeight
                        })
                    } else if ($('.window[pid="' + pid + '"]').hasClass('mail')) {
                        var docHeight = windowData.originalContentHeight
                        $('.window[pid="' + pid + '"] .mail-content').animate({
                            height: docHeight
                        })
                    }
                }
            }
        }
        zIndex++;
        $pid.css({
            zIndex: zIndex
        });
        $pid.css('display', 'block');
        $('.window').removeClass('active-window');
        if ($pid.hasClass('winamp')) return;
        $pid.addClass('active-window');
    }
    setWindowInActive(pid) {
        $('.window').removeClass('active-window');
    }
    removeWindow(pid) {
        $('.window[pid="' + pid + '"]').animate({
            opacity: 0,
            top: $(window).height(), // to force the window to minimize at the bottom corner
            // top: 0,
            left: 0,
            width: '0px',
            height: 0
        });
        if ($('.window[pid="' + pid + '"]').hasClass('winamp')) {
            $('script[src*="winamp2-js/built/winamp.js"]').remove();
        }
        $('.window[pid="' + pid + '"]').promise().done(function() {
            $('.window[pid="' + pid + '"]').remove();
        })
    }
    minimizeWindow(pid) {
            if (!($('.window[pid="' + pid + '"]').is(':animated'))) {
                $('.window[pid="' + pid + '"]').animate({
                    opacity: 0,
                    top: $(window).height(), // to force the window to minimize at the bottom corner
                    // top: 0,
                    left: 0,
                    width: '0px',
                    height: 0
                });
                $('.window[pid="' + pid + '"]').promise().done(function() {
                    $('.window[pid="' + pid + '"]').css({
                        display: "none"
                    });
                });
            }
        }
        // ---------------------------------------------- Shutdown Functions --------------------------------------------------------//
    shutdown() {
        var self = this;
        $('#menu').css('display', 'none');
        $('#desktop').css('pointer-events', 'none');
        $('#shutdown').css('display', 'block');
        SystemUI.insertOverlay('shutdown', true);
        $('#shutdown').off().on('click', '.close', function() {
            SystemUI.removeOverlay();
            $('#shutdown').css('display', 'none');
            $('#desktop').css('pointer-events', 'auto');
        });
        $('#shutdown button').off().on('click', function() {
            if ($(this).val() === "ok") {
                switch ($('input[name=shut]:checked').val()) {
                    case 'shutdown':
                        self.beforeFinalShutdown('shutdown');
                        return;
                    case 'restart':
                        self.beforeFinalShutdown('restart');
                        return;
                    case 'stand-by':
                        self.enterStandby();
                        return;
                    default:
                        SystemUI.setDialogBox('shutdown', 'Programs', '1', 'No Option Selected.');
                }
            } else {
                $('#shutdown #dialog').remove();
                $('#shutdown').css('display', 'none');
                SystemUI.removeOverlay();
                $('#desktop').css('pointer-events', 'auto');
            }
        });

    }
    beforeSystemClose(parentID, callback) {
        var parentSel = $('#' + parentID);
        var saved = true;
        $('.window').each(function() {
            if ($(this).attr('saved') === "false") {
                saved = false;
            }
        });
        if (!saved) {
            SystemUI.setDialogBox(parentID, 'Programs', '4', 'Are you sure you want to close all windows before exiting?');
            $('#' + parentID + " #dialog button").off().on('click', function() {
                //console.log('inDialog');
                $('#' + parentID).css('pointer-events', 'auto');
                $('#' + parentID).css('zIndex', '2147483646');
                var d = $(this).attr('value');
                if (d === "yes") {
                    callback(true);
                } else {
                    $('#' + parentID + " #dialog").remove();
                    callback(false);
                }
            });
        } else {
            callback(true);
        }
    }
    beforeFinalShutdown(shut) {
        var self = this;

        this.beforeSystemClose('shutdown', function(e) {
            if (e) {
                if (shut === 'shutdown') {
                    self.finalShutdown();
                } else if (shut === "restart") {
                    self.restart();
                } else if (shut === "logoff") {
                    self.logoff();
                }
            } else {
                $('#shutdown').css('display', 'none');
                $('#desktop').css('pointer-events', 'auto');
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
        $('body').html('');
        $('body').css('background', 'url(../images/shutdown.jpg) no-repeat center');
        sound.play('sprite3');
        setTimeout(function() {
            $('body').css('background', 'none').html('<h1 style="text-align:center; margin:0 auto;">If you want to see more cool stuff.<br> Go to <a href = "https://github.com/lolstring/">https://github.com/lolstring/</a>.<br> You can contact me on <a href=rahulmehra@techgeek.co.in>rahulmehra@techgeek.co.in</a>.<br> <br><br> <a href="https://rahul.io">Power On</a></h1>')
        }, 4000);
    }
    restart() {
        $('body').html('');
        $('body').css('background', 'url(../images/shutdown.jpg) no-repeat center');
        sound.play('sprite3');
        setTimeout(function() {
            location.reload()
        }, 2000);
    }
    static insertOverlay(id, background) {
        if (background) {
            var overlayData = `<div id="overlay" width="100%" height="100%" style="background:url(images/word%20images/background123.png);"></div>`;
        } else {
            var overlayData = `<div id="overlay" width="100%" height="100%""></div>`;
        }
        $('body').append(overlayData);

        var z = 2147483644;
        $('#overlay').css('zIndex', z - 1);
        $('#' + id).css('zIndex', z);
        $('#overlay').on('click', function(e) {
            e.stopPropagation();
            sound.play('sprite2');
        });
    }
    static removeOverlay() {
        $('#overlay').each(function() {
            $(this).remove();
        });
    }
    enterStandby() {
        var self = this;
        var standByData = `<div id="standby" style="width:100%; height:100%; position:fixed; top:0; left:0;"></div>`;
        $(standByData).appendTo('body');
        $('#shutdown').css('display', 'none');
        $('#desktop').css('pointer-events', 'none');
        SystemUI.setDialogBox('standby', 'Stand By', '1', 'Click ok to stand by');
        $('#standby').css('zIndex', 2147483646);
        $('#standby button').off().on('click', function() {
            self.exitStandBy();
        })
    }
    exitStandBy() {

        SystemUI.removeOverlay();
        $('#standby').remove();
        $('#desktop').css('pointer-events', 'auto');
    }

    // ----------------------------------- Destroy Session ---------------------------//

    destroySession() {
            localStorage.clear();
        }
        //------------------------------------Log off---------------------------------------------------//

    beforeLogoff(destroySession) {
        var self = this;
        var parentSel = '#logoff';
        if (destroySession) {
            $('#logoff p').text('Are you sure you want to destroy session and logoff?');
        }
        $('#logoff').css('display', 'block');
        $('#desktop').css('pointer-events', 'none');
        SystemUI.insertOverlay('logoff', true);
        $('#logoff').off().on('click', '.close', function() {
            SystemUI.removeOverlay();
            $('#logoff').css('display', 'none');
            $('#desktop').css('pointer-events', 'auto');
        });
        $(parentSel + " button").on('click', function() {
            //console.log('inDialog');
            $(parentSel).css('pointer-events', 'auto');
            $(parentSel).css('zIndex', '2147483646');
            var d = $(this).attr('value');
            if (d === "yes") {
                self.beforeSystemClose('logoff #dialog', function(e) {
                    if (e) {
                        if (destroySession) {
                            self.destroySession();
                        }
                        self.logoff();
                        SystemUI.removeOverlay();
                    } else {
                        $('#logoff').css('display', 'none');
                        SystemUI.removeOverlay();
                        $('#desktop').css('pointer-events', 'auto');
                    }
                });
            } else {
                SystemUI.removeOverlay();
                $('#logoff').css('display', 'none');
                $('#desktop').css('pointer-events', 'auto');
            }
            $('#logoff p').text('Are you sure you want to logoff?');
        });
    }
    logoff() {
            sound.play('sprite3');
            setTimeout(function() {
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
            sendCmd: function(value) {
                //$(this.element).trigger('change');
            },
            _create: function() {
                this.wrapper = $("<span>")
                    .addClass("custom-combobox")
                    .insertAfter(this.element);

                this.element.hide();
                this._createAutocomplete();
                this._createShowAllButton();
            },

            _createAutocomplete: function() {
                var selected = this.element.children(":selected"),
                    value = selected.val() ? selected.text() : "";

                this.input = $("<input>")
                    .appendTo(this.wrapper)
                    .val(value)
                    .attr("tabindex", "0")
                    .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                    .autocomplete({
                        delay: 0,
                        minLength: 0,
                        source: $.proxy(this, "_source")
                    })
                    .tooltip({
                        tooltipClass: "ui-state-highlight"
                    });

                this._on(this.input, {
                    autocompleteselect: function(event, ui) {
                        ui.item.option.selected = true;
                        this._trigger("change", event, {
                            item: ui.item.option
                        });

                        this.sendCmd(ui.item.value);


                    },

                    autocompletechange: "_removeIfInvalid"
                });
            },

            _createShowAllButton: function() {
                var input = this.input,
                    wasOpen = false;

                $("<a>")
                    .attr("tabIndex", -1)
                    .appendTo(this.wrapper)
                    .button({
                        icons: {
                            primary: "ui-icon-triangle-1-s"
                        },
                        text: false
                    })
                    .removeClass("ui-corner-all")
                    .addClass("custom-combobox-toggle ui-corner-right")
                    .mousedown(function() {
                        wasOpen = input.autocomplete("widget").is(":visible");
                    })
                    .click(function() {
                        //input.focus();

                        // Close if already visible
                        if (wasOpen) {
                            return;
                        }

                        // Pass empty string as value to search for, displaying all results
                        input.autocomplete("search", "");
                    });
            },

            _source: function(request, response) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                response(this.element.children("option").map(function() {
                    var text = $(this).text();
                    if (this.value && (!request.term || matcher.test(text)))
                        return {
                            label: text,
                            value: text,
                            option: this
                        };
                }));
            },

            _removeIfInvalid: function(event, ui) {

                // Selected an item, nothing to do
                if (ui.item) {
                    return;
                }

                // Search for a match (case-insensitive)
                var value = this.input.val(),
                    valueLowerCase = value.toLowerCase(),
                    valid = false;
                this.element.children("option").each(function() {

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
                this.element.append($('<option>', {
                    value: this.input.val(),
                    text: this.input.val()
                }));;
                this.input.autocomplete("instance").term = "";
            },

            _destroy: function() {
                this.wrapper.remove();
                this.element.show();
            }
        });
        $("#combobox").combobox();
        //End Data*/f
    }
    runProgram(value) {
            var v1 = value.toLowerCase();
            var pid = $('#run').attr('pid');
            var self = this;
            if (~v1.indexOf('word')) {
                this.newWord();
            } else if (~v1.indexOf('notepad')) {
                this.newNotepad();
            } else if (~v1.indexOf('winamp')) {
                this.newWinamp();
            } else if (~v1.indexOf('mail')) {
                this.newMail();
            } else if (~v1.indexOf('minesweeper')) {
                $('.desktop-icon[program-name="minesweeper"]').trigger('dblclick');
            } else if (~v1.indexOf('wolf')) {
                this.newWolf();
            } else if (~v1.indexOf('help')) {
                console.log(this.runProgram.toString());
            } else if (~v1.indexOf('.doc')) {
                value = value.replace('.doc', '');
                var a = this.checkIfFileExists(value, 'doc');
                if (a) {
                    this.newWord(a);
                } else {
                    SystemUI.setDialogBox('run', 'Error', '1', 'Please check your file name. Click OK to continue.');
                    return;
                }
            } else if (~v1.indexOf('.pdf')) {
                value = value.replace('.pdf', '');
                var a = this.checkIfFileExists(value, 'pdf');
                if (a) {
                    this.newWord(a);
                } else {
                    SystemUI.setDialogBox('run', 'Error', '1', 'Please check your file name. Click OK to continue.');
                    return;
                }
            } else if (~v1.indexOf('.txt')) {
                value = value.replace('.txt', '');
                var a = this.checkIfFileExists(value, 'txt');
                if (a) {
                    this.newNotepad(a);
                } else {
                    SystemUI.setDialogBox('run', 'Error', '1', 'Please check your file name. Click OK to continue.');
                    return;
                }
            } else {
                SystemUI.setDialogBox('run', value, '1', 'Cannot find the file ' + value + '. Make sure the path and filename are correct and that all required libraries are available.<br> Commands Supported:<br>&nbsp;&#149;Installed Executable<br>&nbsp;&#149;Filename with Extension<br>&nbsp;');
                return;
            }
            self.beforeWindow(pid, function() {
                self.programMinimize(pid);
            })
        }
        //----------------------------------------------- SAVE/OPEN/ATTACH WINDOW FUNCTIONS -----------------------------------------//
    showOpen(parentId) {
        //e.preventDefault();
        var openSel = '#' + parentId + ' #open';
        $(openSel).css('display', 'block');
        // .draggable({
        // 	handle: '.title-bar'
        // });
        this.updateContentBox(openSel);
        var offset = $(openSel).offset();
        $(openSel).css({
            "top": offset.top,
            "left": offset.left,
            "position": "fixed"
        });
        $('#' + parentId).closest('[id]').css('pointer-events', 'none');
        $(openSel).css('pointer-events', 'auto');
        if (this.botOpen === false) {
            globalBot.agent(function(a) {
                a.moveTo(offset.left + 150, offset.top + 150);
                a.speak('You can open a file from this desktop.')
            });
            this.botOpen = true;
        }
    }
    showSave(parentId) {
        var saveSel = '#' + parentId + ' #save';
        $(saveSel).css('display', 'block');
        // .draggable({
        // 	handle: '.title-bar'
        // });
        this.updateContentBox(saveSel);
        var offset = $(saveSel).offset();
        $(saveSel).css({
            "top": offset.top,
            "left": offset.left,
            "position": "fixed"
        });
        $('#' + parentId).closest('[id]').css('pointer-events', 'none');
        $(saveSel).css('pointer-events', 'auto');

        if (this.botSave === false) {
            globalBot.agent(function(a) {
                a.moveTo(offset.left + 150, offset.top + 150);
                a.speak('You can save to desktop which is internally stored to Local Storage so be careful when you clear cache or you can download it to your own computer.')
            });
            this.botSave = true;
        }
    }

    updateContentBox(e) {
        var content = $(e + ' .content1-box');
        //var childOffset1 ={top,left};
        $(e + ' .user-file-list').remove();
        var b = this.getFromLocal();
        var extension, img, type, filename;

        $.each(b, function(i, e) {
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
            var iconData = '<div class="folder-list user-file-list" fileID="' + e.fileID + '" type="' + extension + '" tabindex="0"><img class="icon" src="' + img + '" style="width:14px;"/><span style="vertical-align:top">' + filename + '</span></div>'
            $(iconData).appendTo(content);
        });
    }
    print(content) {
        // $.cachedScript("vendor/jspdf.min.js").done(function(script, textStatus) {
        //     var printDoc = new jsPDF();
        //     printDoc.fromHTML(content, 10, 10, {
        //         'width': 180
        //     });
        //     printDoc.autoPrint();
        //     printDoc.output("dataurlnewwindow");
        // });
        return xepOnline.Formatter.Format(parentId + '-content .document-wrap', {
                render: 'newwin',
                filename: 'print'
                    //attach:parentId,
                    //fileID:'file-1473946043124'
            });
    }
    printFile(parentId) {
       return xepOnline.Formatter.Format(parentId + '-content .document-wrap', {
                render: 'newwin',
                filename: 'print'
                    //attach:parentId,
                    //fileID:'file-1473946043124'
            });
    }
    open(windowId) {
        var self = this;
        var parentId = $(windowId).closest('[id]').parent().closest('[id]').attr('id');
        var parentSel = '#' + parentId;
        var fileID = $(parentSel + ' #open .fileID').val()
            //var type = $(parentSel + ' #open select#file-type').val();
            //var location = $(parentSel + ' #open select#open-location').val();
            //console.log(parentId + ' ' + location);
        var filename = $(parentSel + ' #open input.filename').val();
        //console.log("open FUNCTION-filename:" + filename);
        if (filename == "") {
            SystemUI.setDialogBox(parentId, 'Error', '1', 'Please enter a file name. Click OK to continue.');
            $(parentSel + ' #open').css('pointer-events', 'none');
            $("#dialog button").on('click', function() {

                $(parentSel + " #open").css('pointer-events', 'auto');

            });
        } else {
            var saved = $(parentSel).attr('saved');
            if (saved == 'false') {
                var wantToClose = SystemUI.setDialogBox(parentId, 'Microsoft Word', '4', 'Are you sure you want to close before exiting?');
                $(parentSel + " #dialog button").on('click', function() {
                    //console.log('inDialog');
                    $(parentSel).css('pointer-events', 'auto');
                    var d = $(this).attr('value');

                    if (d == "yes") {
                        var a = self.getFileFromLocal(fileID);
                        $(parentSel).children().children().children('.title').text(a.filename);
                        $('#task-' + parentId + ' p').text(filename);
                        $(parentSel).find('.document-wrap').html(a.content);
                        $(parentSel).attr('fileid', fileID);
                        MsWord._wordNumberRemove($(parentSel).attr('docNumber'));
                        $(parentSel + ' #open').css("display", "none");
                        $(parentSel).css('pointer-events', 'auto');
                        $(parentSel).attr('saved', 'true');
                    } else if (d == "no") {
                        $(parentSel + " #dialog").css('display', 'none');
                        $(parentSel + " #open").css('display', 'block');
                    } else if (d == "cancel") {
                        $(parentSel + " #dialog").css('display', 'none');
                        $(parentSel + " #open").css('display', 'block');
                    }
                });
            } else {
                var a = this.getFileFromLocal(fileID);
                $(parentSel).children().children().children('.title').text(a.filename);
                $('#task-' + parentId + ' p').text(filename);
                $(parentSel).find('.document-wrap').html(a.content);
                $(parentSel).attr('fileid', fileID);
                MsWord._wordNumberRemove($(parentSel).attr('docNumber'));
                $(parentSel + ' #open').css("display", "none");
                $(parentSel).css('pointer-events', 'auto');
                $(parentSel).attr('saved', 'true');
            }
        }
    }
    save(windowId) {
        var parentId = $(windowId).closest('[id]').parent().closest('[id]').attr('id');
        var parentSel = '#' + parentId;
        var type = $(parentSel + ' #save select#file-type').val();
        var location = $(parentSel + ' #save select#save-location').val();
        var filename = $(parentSel + ' #save input.filename').val();
        if (filename == "") {
            SystemUI.setDialogBox(parentId, 'Error', '1', 'Please enter a file name. Click OK to continue.');
            $(parentSel + ' #save').css('pointer-events', 'none');
            $("#dialog button").on('click', function() {

                $(parentSel + " #save").css('pointer-events', 'auto');

            });
        } else {
            if (location === "desktop") {
                var contentDocument = $(parentSel + '-content .document-wrap').html();
                var contentTxt = contentDocument.trim();
                this.saveToLocal(parentId, filename, contentDocument, type);
                var c = filename + ' - Microsoft Word'
                $(parentSel).children().children().children('.title').text(c);
                $('#task-' + parentId + ' p').text(filename);
                $(parentSel + ' #save').css("display", "none");
                $(parentSel).css('pointer-events', 'auto');
            } else if (location === "computer") {
                this.saveFile(parentId, filename, type);
                $(parentSel + ' #save').css("display", "none");
            } else if (location === null) {
                SystemUI.setDialogBox(parentId, 'Error', '1', 'Please Choose a location.');
                //$(parentSel + ' #save').css('pointer-events', 'none');
            }
            $("#dialog button").on('click', function() {
                $(parentSel).css('pointer-events', 'auto');
            });
        }
    }
    getFromLocal() {
        var a = [],
            localData;
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        //var localData = JSON.parse(localStorage.getItem("user")).find(function(e){return e.username = JSON.parse(localStroage.getItem('currentUser')).username});

        if (localData != null && typeof localData != "undefined" && localData.files.length > 0) {
            $.each(localData.files, function(i, e) {
                var b = {
                    fileID: e.fileID,
                    program: e.program,
                    filename: e.filename,
                    type: e.type
                };
                //if(typeof a != "undefined" && a != null && a.length > 0){
                a.pushIfNotExist(b, function(k) {
                    return k.fileID === b.fileID && k.filename === b.filename && k.type === b.type
                });
                //	}
                //	else{//this doesn't execute
                //		console.log("nothere");
                //		a.push({filename:e.filename,type:e.type});
                //	}
            });
            return a;
        } else {
            console.log("No Files");
        }
    }
    getFileFromLocal(fileID) {
        var contentDocument;
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        for (var i = 0; i < localData.files.length; i++) {
            if (fileID === localData.files[i].fileID) {
                contentDocument = localData.files[i];
                break;
            }
        }
        return contentDocument;
    }

    saveToLocal(parentId, filename, contentDocument, type) {
        if (typeof(Storage) !== "undefined") {
            $('#' + parentId).attr('saved', true);
            var program = $('#' + parentId).attr('program-name');
            var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
                return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
            });
            if (result.length == 1) {
                var localData = result[0];

            }
            var exists = this.checkIfFileExists(filename, type);
            if (exists) {
                if ($('#' + parentId).attr('fileid') != exists) {
                    SystemUI.setDialogBox(parentId, 'Microsoft Word', '4', 'Do you want to replace the existing ' + filename + '.' + type + '?');
                    $("#" + parentId + " #dialog button").on('click', function() {
                        var d = $(this).attr('value');
                        if (d == "yes") {
                            for (var i = 0; i < localData.files.length; i++) {
                                if (filename === localData.files[i].filename && type === localData.files[i].type) {
                                    $('#' + parentId).attr('fileid', localData.files[i].fileID);
                                    localData.files[i].content = contentDocument;
                                    localData.files[i].modifiedDate = Date.now();
                                    break;
                                }
                            }
                            var users = JSON.parse(localStorage.getItem('users'));
                            $.each(users.users, function(k, v) {
                                if (this.username === JSON.parse(localStorage.getItem('currentUser')).username) {
                                    this.files = localData.files;
                                    return false;
                                }
                            });
                            localStorage.setItem('users', JSON.stringify(users));
                            $("#" + parentId + " #dialog").css('display', 'none');
                        } else if (d == "no") {
                            $("#" + parentId + " #dialog").css('display', 'none');
                            $("#" + parentId + " #save").css('display', 'block');
                        } else if (d == "cancel") {
                            $("#" + parentId + " #dialog").css('display', 'none');
                        }
                    });
                } else {
                    for (var i = 0; i < localData.files.length; i++) {
                        if (filename === localData.files[i].filename && type === localData.files[i].type) {
                            $('#' + parentId).attr('fileid', localData.files[i].fileID);
                            localData.files[i].content = contentDocument;
                            localData.files[i].modifiedDate = Date.now();
                            break;
                        }
                    }
                    var users = JSON.parse(localStorage.getItem('users'));
                    $.each(users.users, function(k, v) {
                        if (this.username === JSON.parse(localStorage.getItem('currentUser')).username) {
                            this.files = localData.files;
                            return false;
                        }
                    });
                }
            } else if (!(exists)) {
                var fid = 'file-' + Date.now()
                localData.files.push({
                    'fileID': fid,
                    'filename': filename,
                    'content': contentDocument,
                    'type': type,
                    'program': program,
                    'creationDate': Date.now(),
                    'modifiedDate': Date.now()
                })
                var users = JSON.parse(localStorage.getItem('users'));
                $.each(users.users, function(k, v) {
                    if (this.username === JSON.parse(localStorage.getItem('currentUser')).username) {
                        this.files = localData.files;
                        //currentUser = v;
                        return false;
                    }
                });
                localStorage.setItem('users', JSON.stringify(users));
                $('#' + parentId).attr('fileid', fid);
                this.setNewDesktop(fid, program, filename, type);
            }
        } else {
            console.log('Local storage is not supported');
        }
    }

    checkIfFileExists(filename, type) {
        var a, b;
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        $.each(localData.files, function() {
            if (this.filename == filename && this.type == type) {
                a = true;
                b = this.fileID;
                return false;
            } else if (this.filename != filename) {
                b = false;
            }
        })
        return b;
    }
    rename(fileID, filename) {
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        for (var i = 0; i < localData.files.length; i++) {
            if (fileID === localData.files[i].fileID) {
                localData.files[i].filename = filename;
                localData.files[i].modifiedDate = Date.now();
                break;
            }
        }
        var users = JSON.parse(localStorage.getItem('users'));
        $.each(users.users, function(k, v) {
            if (this.username === JSON.parse(localStorage.getItem('currentUser')).username) {
                this.files = localData.files;
                return false;
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
        var pid = $('.window[fileid="' + fileID + '"]').attr('pid');
        $('.window[fileid="' + fileID + '"]').find('.title').text(filename);
        $('#taskbar [pid="' + pid + '"] p').text(filename);
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
        if (type == "pdf") {
            // console.log('here');
            // $.cachedScript("vendor/jspdf.min.js").done(function(script, textStatus) {
            // 	console.log('<<< Caching >>>>' + textStatus);
            // 	var printDoc = new jsPDF();
            // 	var images = $('#' + parentId + '-content img');
            // 	console.log('here1');
            // 	printDoc.fromHTML($('#' + parentId + '-content').get(0), 10, 10, {
            // 		'width': 180
            // 	});

            // 	console.log('here2');
            // 	printDoc.save(filename + '.pdf');

            // 	//$('#' + parentId).css('pointer-events', 'none');

            // });
            // $.cachedScript("vendor/xepOnline.jqPlugin.js").done(function(script, textStatus) {
            // 	console.log('PDF');
            // 	return xepOnline.Formatter.Format(parentId + '-content .document-wrap', {
            // 		render: 'embed',
            // 		filename: filename
            // 	});
            // });
            // });
            $('#' + parentId).css('pointer-events', 'auto');
            return xepOnline.Formatter.Format(parentId + '-content .document-wrap', {
                render: 'download',
                filename: filename
                    //attach:parentId,
                    //fileID:'file-1473946043124'
            });
            $('#' + parentId).css('pointer-events', 'auto');
        } else if (type == "word" || type == "doc") {
            this.convertImagesToBase64(parentId);
            $.cachedScript("scripts/vendor.js").done(function(script, textStatus) {
                //$.cachedScript("../vendor/html-docx.js").done(function(script, textStatus) {
                var contentDocument = $('#' + parentId + '-content').html();
                var content = '<!DOCTYPE html><html><head></head><body>' + contentDocument + '</body></html>';
                var orientation = 'potrait';
                var converted = htmlDocx.asBlob(content, {
                    orientation: orientation
                });
                saveAs(converted, filename + '.docx');
            });
        } else if (type == "txt") {
            var contentTxt = $('#' + parentId + '-content').text();
            contentTxt = contentTxt.trim();
            var blob = new Blob([contentTxt], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, filename + '.txt');
        } else {
            console.log('error');
        }
        $('#' + parentId).css('pointer-events', 'auto');
        //}
    }
    convertImagesToBase64(parentId) {
        var contentDocument = $('#' + parentId + '-content').html();
        var regularImages = $('#' + parentId + '-content img');
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        [].forEach.call(regularImages, function(imgElement) {
            // preparing canvas for drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            ctx.drawImage(imgElement, 0, 0);
            // by default toDataURL() produces png image, but you can also export to jpeg
            // checkout function's documentation for more details
            var dataURL = canvas.toDataURL();
            imgElement.setAttribute('src', dataURL);
        })
        canvas.remove();
    }
    deleteFile(fileID) {
        globalBot.agent(function(a) {
            a.speak('Are you sure you want to delete this file?')
        });
        if (fileID === 'file-0000000000001' || fileID === 'file-0000000000002') {
            SystemUI.setDialogBox('desktop', 'Error', '1', 'You can not delete this file.');
            return;
        }
        var result = $.grep(JSON.parse(localStorage.getItem('users')).users, function(e) {
            return e.username == JSON.parse(localStorage.getItem('currentUser')).username;
        });
        if (result.length == 1) {
            var localData = result[0];
        }
        for (var i = 0; i < localData.files.length; i++) {
            if (localData.files[i].fileID === fileID) {
                localData.files.splice(i, 1);
            }
        }
        var users = JSON.parse(localStorage.getItem('users'));
        $.each(users.users, function(k, v) {
            if (this.username === JSON.parse(localStorage.getItem('currentUser')).username) {
                this.files = localData.files;
                return false;
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
        $('.desktop-icon[fileid="' + fileID + '"').remove();
        $('.window[fileid="' + fileID + '"]').attr("saved", false);
    }
    attach(windowId) {
        var parentId = $(windowId).closest('[id]').parent().closest('[id]').attr('id');
        var parentSel = '#' + parentId;
        var fileids = $(parentSel + ' #attach .fileID').val().split('|');
        for (var i = 0; i < fileids.length; i++) {

            this.attachCreate(parentSel, fileids[i]);
        }
    }
    attachCreate(parentID, fileID) {
        var self = this;
        self.parentID;
        if (fileID) {

            self.file = this.getFileFromLocal(fileID);
            self.fileBlob = '';
            if (self.file.type === "pdf") {
                self.fileBlob = 'pdf';
                self.attachAppend(parentID, self.file, self.fileBlob);
            } else {
                this.fileToBlob(self.file.content, self.file.type, function(abc) {
                    self.fileBlob = abc;
                    self.attachAppend(parentID, self.file, self.fileBlob);
                });
            }
        } else {
            return;
        }
    }
    attachAppend(parentID, file, fileBlob) {
        if ($(parentID + ' div.attachment [file-id="' + file.fileID + '"]').length < 1) {
            var iconURL = programData.getIconByType(file.type);
            var attachData = `<div file-id="${file.fileID}" class="attached-list">
		<img class="icon" src="${iconURL}"/>
		<span>${file.filename}</span>
		<div class="cancel" >
		&nbsp;
		</div>
		</div>`;
            $(attachData).appendTo(parentID + ' div.attachment');
            $('[file-id="' + file.fileID + '"]').data({
                file: fileBlob
            });
            $(parentID + ' #attach').css('display', 'none');
            $(parentID).css('pointer-events', 'auto');
        } else {
            SystemUI.setDialogBox(parentID, 'Attach', '1', 'You have already attached ' + file.filename + '.' + file.type);
        }
    }
    fileToBlob(contentDocument, type, callback) {
        var self = this;
        self.blob = '';
        self.contentDocument = contentDocument;
        if (type === "word" || type === "doc") {
            $.cachedScript("scripts/vendor.js").done(function(script, textStatus) {
                //$.cachedScript("vendor/html-docx.js").done(function(script, textStatus) {
                var content = '<!DOCTYPE html><html><head></head><body>' + contentDocument + '</body></html>';
                var orientation = 'potrait';
                self.blob = htmlDocx.asBlob(content, {
                    orientation: orientation
                });
                callback(self.blob);
            });
        } else if (type === "text" || type === "txt") {
            var contentTxt = contentDocument.trim();
            self.blob = new Blob([contentTxt], {
                type: "text/plain;charset=utf-8"
            });
            callback(self.blob);;
        } else {
            self.blob = 'blobError';
            callback(self.blob);
        }
    }
    attachPDFData(parentId, fileID, filename, content, type) {
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
            var self = this;
            windowID = windowID.substring(1);
            var taskID = 'task-' + windowID;
            var iconURL = programData.getIcon(program);
            var taskbarData = `<span class="window-open" id="${taskID}" pid="${processID}" program-name="${program} "title="${description}">
			<img class="icon" src="${iconURL}"/>
			<p class="text">${description}</p>
		</span>'`;
            $(taskbarData).appendTo('#task').promise().done(function() {
                //log('Create Set Active'); //STILL TO BE MADE//self.setActive(processID);
            });
            self.setTaskPosition();
        }
        /**
         * REDO!!!!!
         * @param {taskID}
         * 
         */
    setTaskPosition() {
        var availableWidth = $('#taskbar').outerWidth() - 228,
            numberOpen = $('.window-open').length,
            maxWidth = parseInt($('.window-open').css('max-width'), 10),
            minWidth = parseInt($('.window-open').css('min-width'), 10),
            width;
        if (numberOpen > 0) {
            if ((numberOpen * maxWidth) > availableWidth) {
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
        $('.window-open').css('width', width);
    }
    taskSplit() {
        var childNodes = $('.window-open');
        var numberFit = Math.round(($('#taskbar').outerWidth() - 228) / 30) - 11;
        var totalChildNodes = childNodes.length;
        var numberOfPages = Math.ceil(totalChildNodes / numberFit);
        var parentElement = $('<span id="task"></span>');
        var temp, i, j = 1,
            k = 0;
        for (i = 1; i <= numberOfPages; i++) {
            temp = '<span id= "task-' + i + '" class="task-page" style="display:none;" page-num="' + i + '"></span>';
            $(parentElement).append(temp);
        }
        for (i = 0; i < totalChildNodes; i++) {
            k++;
            $(parentElement).children('#task-' + j).append(childNodes[i]);
            if (k >= numberFit) {
                j++;
                k = 0;
            }
        }
        $('#task').replaceWith(parentElement);
        $('#task-' + j).css('display', 'inline').addClass('active-page');
        if (numberOfPages > 1) {
            $('#pagination').css('visibility', 'visible');
        } else {
            this.showTaskPage(1);
            $('#pagination').css('visibility', 'hidden');
        }
    }
    showTaskPage(num) {
        $('.task-page').css('display', 'none').removeClass('active-page');
        $('#task-' + num).css('display', 'inline').addClass('active-page');
    }
    upTaskPage() {
        var numberOfPages = $('.task-page').length;
        var id = parseInt($('.active-page').attr('page-num'));
        id++;
        id < 1 || id > numberOfPages ? '' : this.showTaskPage(id);
    }
    downTaskPage() {
        var numberOfPages = $('.task-page').length;
        var id = parseInt($('.active-page').attr('page-num'));
        id--;
        id < 1 || id > numberOfPages ? '' : this.showTaskPage(id);
    }
    taskNoSplit() {
        var a = 0;
        return a;
    }
    removeTask(pid) {
        $('#taskbar [pid="' + pid + '"]').remove();
        this.setTaskPosition();
    }
    setTaskActive(pid) {
        $('#task span.active-task').removeClass('active-task');
        $('#task [pid="' + pid + '"]').addClass('active-task');
    }
    setTaskInActive(pid) {
        $('#task span.active-task').removeClass('active-task');
        //$('#task [pid="' + pid + '"]').addClass('active-task');
    }
    minimizeTask(pid) {
        $('#task [pid="' + pid + '"]').removeClass('active-task');
    }

    //------------------------------------------ Dialog Box Functions ---------------------------------------------- //



    static setDialogBox(parentId, title, type, errorMessage) {
        var self = this;
        if (parentId.indexOf('#') == 0) {
            parentId = parentId.slice(1, parentId.length);
        }
        var dialogData = '<div id="dialog" class="dialog window active-window ui-widget-content"> <div class="window-border"> <div class="title-bar h-count"> <div class="control-box"> <a class="button-3d close-dialog"><span>&nbsp;</span></a> </div> <span class="title"> ' + title + ' </span> </div> <div class="error-content"> <div class="text"> <img class="icon" src="images/win98_icons/exclamation.ico"/> <p>' + errorMessage + '</p><br> </div> <div class="button"></div> </div> </div>';

        $(dialogData).appendTo('#' + parentId);

        $("#dialog .title").text(title);
        if (type == "1" || type == "error") {
            $("#" + parentId + " #dialog img").attr("src", "../images/win98_icons/error.ico");
            $("#dialog .button").append("<button value='ok'>Ok</button>");
        } else if (type == "2" || type == "warning") {
            $("#dialog img").attr("src", "../images/win98_icons/exclamation.ico");
            $("#dialog .button").append("<button value='yes'>Yes</button>");
        } else if (type == "3" || type == "information") {
            $("#dialog img").attr("src", "../images/win98_icons/information.ico");
            $("#dialog .button").append("<button value='yes'>Yes</button>");
        } else if (type == "4" || type == "replace" || type == "leave") {
            $("#dialog img").attr("src", "../images/win98_icons/exclamation.ico");
            $("#dialog .button").html("<button value='yes'>Yes</button><button value='no'>No</button><button value='cancel'>Cancel</button>");
        } else if (type == "5" || type == "logoff") {
            $("#dialog img").attr("src", "../images/win98_icons/key_win.ico");
            $("#dialog .button").html("<button value='yes'>Yes</button><button value='no'>No</button>");
        } else if (type == "6" || type == "delete") {
            $("#dialog img").attr("src", "../images/win98_icons/erase_file.ico");
            $("#dialog .button").html("<button value='yes'>Yes</button><button value='no'>No</button>");
        }
        //$("#dialog p").text(errorMessage);

        /**
         * No pointer events on parent windows when dialog box open. 
         */
        $("#" + parentId + " #dialog").css("display", "block");
        SystemUI.insertOverlay(parentId, false);
        $('#' + parentId + " #dialog").css('zIndex', 2147483645);
        $("#" + parentId + " #dialog").css('position', 'fixed');
        //var offset = $("#" + parentId + " #dialog").offset();
        $("#" + parentId).css('pointer-events', 'none');
        $("#" + parentId + ' #save').css('pointer-events', 'none');
        $("#" + parentId + ' #open').css('pointer-events', 'none');
        $("#" + parentId + " #dialog").css('pointer-events', 'auto');
        $("#" + parentId + " #dialog .title-bar").css('pointer-events', 'none');
        /**
         * Event for Dialog Box
         * @param  {button}
         * @return {[type]}
         */
        $("#dialog button").on('click', function() {
            SystemUI.removeOverlay();
            $('#' + parentId).css('pointer-events', 'auto');
            //$(this).closest('[id]').parent().closest('[id]').css('pointer-events', 'auto');
            $("#" + parentId + ' #save').css('pointer-events', 'auto');
            $("#" + parentId + ' #open').css('pointer-events', 'auto');
            //$(this.closest('[id]')).draggable('enable');
            $("#" + parentId + " #dialog").remove();
            //$("#" + parentId + " #dialog").css("positon", "relative");
        })
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
            var $icons = $('.desktop-icon[program-name!="recyclebin"]'),
                iconHeight = 71,
                iconWidth = 82,
                containerHeight = $(window).height(),
                containerWidth = $(window).width(),
                numberFit = Math.floor(containerHeight / (iconHeight + 8)),
                otop, oleft, indexY = 0,
                indexX = 0,
                count = 0;
            $icons.each(function(i) {
                count++;
                otop = parseInt($(this).css('top'), 10);
                oleft = parseInt($(this).css('left'), 10);
                console.log('Top: ' + otop + '/' + iconHeight + '=');
                console.log('Left: ' + oleft + '/' + iconWidth + '=');
                if (i == 0) return;
                if (otop % iconHeight == 0) {
                    indexY = (otop / iconHeight) + 1;
                } else {
                    var a = document.elementFromPoint((indexX * iconWidth) + 8, (indexY * iconHeight) + 8);
                    if (a.classList.contains('desktop-icon')) {
                        return;
                    } else return false;
                };
                if (oleft % iconWidth == 0) {
                    indexX = (oleft / iconWidth);
                } else {
                    var a = document.elementFromPoint((indexX * iconWidth) + 8, (indexY * iconHeight) + 8);
                    if (a.classList.contains('desktop-icon')) {
                        return;
                    } else return false;
                };
                if (indexY > numberFit) {
                    indexY = 0;
                    indexX++;
                }
            });

            var a = {
                left1: indexX * iconWidth,
                top1: indexY * iconHeight
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
        var extension, img, type, filename, a;
        var b = this.getFromLocal();
        var self = this;
        $.each(b, function(i, e) {
            //a = self.getDesktopPos();
            if(e.fileID === 'file-0000000000001') return;
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
            self.iconNumber++;
            //var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
            //margin-left:-10px;
            //var iconData = '<div draggable="true" id="desktop-icon-' + self.iconNumber + '" class="desktop-icon user-file" data-item="' + self.iconNumber + '" tabindex="0" fileID="' + e.fileID + '" program-name="' + e.program + '" type="' + extension + '" style="background:url(' + img + ') no-repeat center top;background-size: 32px; top:' + a.top1 + 'px; left:' + a.left1 + 'px;"><p class="text" style="text-align:center;"><span>' + filename + '</span></p></div>';
            var iconData = '<div draggable="true" id="desktop-icon-' + self.iconNumber + '" class="desktop-icon user-file" data-item="' + self.iconNumber + '" tabindex="0" fileID="' + e.fileID + '" program-name="' + e.program + '" type="' + extension + '" style="background:url(' + img + ') no-repeat center top;background-size: 32px; "><p class="text" style="text-align:center;"><span>' + filename + '</span></p></div>';

            $(iconData).appendTo('#desktop-icons').draggable({
                opacity: 0.7,
                delay: 400,
                snap: [71, 82],
                containment: '#desktop'
            });
        });
        setTimeout(function() {
            $('#desktop-icons').setInitialIcons();
        }, 500)
    }
    setNewDesktop(fileID, program, filename, type, shortcut) {
        var self = this;
        var extension, img;
        var stclass = '';
        if (shortcut) {
            stclass = 'shortcut'
        };
        var a = this.getDesktopPos();
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
        self.iconNumber++;
        //var iconNumber = memphis.completeArr(memphis.desktopIconNumber);
        var iconData = '<div draggable="true" id="desktop-icon-' + self.iconNumber + '" class="desktop-icon user-file ' + stclass + ' " data-item="' + self.iconNumber + '" tabindex="0" fileID="' + fileID + '" program-name="' + program + '" type="' + extension + '" style="background:url(' + img + ') no-repeat center top;background-size: 32px; top:' + a.top1 + 'px; left:' + a.left1 + 'px;"><p class="text" style="text-align:center; margin-left:-10px;"><span>' + filename + '</span></p></div>';
        $(iconData).appendTo('#desktop-icons').draggable({
            opacity: 0.7,
            delay: 400,
            grid: [64, 64],
            containment: "#desktop"
        });;
        //memphis.desktopInit();
        //console.log(iconNumber);
    }

    // --- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- MS WORD Functions() -- -- -- -- -- -- -- -- -- -- -- -//

    newWord(fileID) {
            var self = this;
            var processID = this.newProcess();
            if (!fileID) {
                var p = new MsWord(processID);
            } else {
                var p = new MsWord(processID, fileID);
            }
            super.addProcess(processID, 'msword', p.windowID, p.description);
            //super.access();
            self.setWindowPosition(p.windowID);
            self.appendTask(processID, 'msword', p.windowID, p.description);
            self.setActive(processID);
        }
        // Mail Functions(){
    newMail(fileID) {
        var self = this;
        var processID = this.newProcess();
        var p = new MailClient(processID);
        super.addProcess(processID, 'mail', p.windowID, p.description);
        self.setWindowPosition(p.windowID);
        self.appendTask(processID, 'mail', p.windowID, p.description);
        self.setActive(processID);
        self.attachCreate(p.windowID, fileID);
    }
    sendEmail(windowId) {
            var toEmail = $('#' + windowId + ' input.sendTo').val().split(',');
            var ccEmail = $('#' + windowId + ' input.sendToCC').val().split(',');
            if (toEmail > 1) {
                SystemUI.setDialogBox(windowId, 'Email address', '1', 'Please enter only 1 email address to send an email to');
            }
            if (ccEmail > 1) {
                SystemUI.setDialogBox(windowId, 'Email address', '1', 'Please enter only 1 email address to send a carbon copy to');
            }
            var subject = $('#' + windowId + ' input.subject').val();
            var files = $('#' + windowId + 'div.attachement').children();
            for (var i = 0; i < files.length; i++) {
                $(files[i]).data();
                //php is left.
            }
            var body = $('#' + windowId + ' .mail-content').text();
            window.open('mailto:'+toEmail[0]+'?cc='+ccEmail[0]+'&subject='+subject+'&body='+body);
        }
        // -- -- --- -- --- -- --- -- -- -- - Context Menu's -- --- -- -- --- -- -- -- -- - -- //
    contextMenuInit() {
        var self = this;
        var file, filename, type;
        $.contextMenu({
            className: 'desktop-context-menu',
            selector: '.user-file',
            callback: function(key, options) {
                var k = key;
                switch (key) {
                    case "open":
                        self.program(this);
                        break;
                    case "print":
                        file = self.getFileFromLocal($(this).attr('fileid'));
                        self.print(file.content);
                        break;
                    case "desktop":
                        alert(k);
                        break;
                    case "mail":
                        self.newMail($(this).attr('fileid'));
                        break;
                    case "delete":
                        var wantToClose = SystemUI.setDialogBox('desktop', 'Delete File', '6', 'Are you sure you want to permenently delete \'' + $(this).text() + '.' + $(this).attr('type') + '\'?');
                        var that = this;
                        $("#desktop" + " #dialog button").on('click', function() {
                            var d = $(this).attr('value');
                            if (d == "yes") {
                                self.deleteFile($(that).attr('fileid'));
                            }
                        });
                        //self.deleteFile($(this).attr('fileid'));
                        break;
                    case "createShortcut":
                        file = self.getFileFromLocal($(this).attr('fileid'));
                        self.setNewDesktop(file.fileID, file.program, file.filename, file.type, true);

                        break;
                    case "properties":
                        self.properties($(this).attr('fileid'));
                        break;
                    case "rename":
                        $(this).children().children().attr('contentEditable', true);
                        $(this).children().children().focus();
                        var that = this;
                        $(this).children().children().on('blur', function() {
                            $(this).removeAttr('contentEditable');
                            $(this).removeAttr('autocomplete');
                            filename = $(this).text();
                            self.rename($(that).attr('fileid'), filename);
                        });
                        break;
                    default:
                        console.log('Shouldnt');
                }
            },
            items: {
                open: {
                    name: "Open",
                    accesskey: "O",
                    className: "context-menu-bold"
                },
                print: {
                    name: "Print",
                    accesskey: "P"
                },
                "sep1": "---------",
                sendTo: {
                    name: "Send To",
                    accesskey: "T",
                    items: {
                        desktop: {
                            name: "Desktop",
                            accesskey: "D"
                        },
                        mail: {
                            name: "Mail Recipient",
                            accesskey: "M"
                        }
                    }
                },
                "sep2": "---------",
                cut: {
                    name: "Cut",
                    accesskey: "t",
                    disabled: true
                },
                copy: {
                    name: "Copy",
                    accesskey: "c",
                    disabled: true
                },
                "sep3": "---------",
                createShortcut: {
                    name: "Create Shortcut",
                    accesskey: "s"
                },
                delete: {
                    name: "Delete",
                    accesskey: "d"
                },
                rename: {
                    name: "Rename",
                    accesskey: "m"
                },
                "sep4": "---------",
                properties: {
                    name: "Properties",
                    accesskey: "r"
                }
            }
        });
        $.contextMenu({
            selector: '.word .menu-bar .file',
            //appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
            trigger: 'left',
            position: function(opt, x, y) {
                var a = this.offset();
                opt.$menu.css({
                    top: a.top + 10,
                    left: a.left - 10
                })
            },
            className: 'word-file-context-menu',
            callback: function(key, options) {
                var parentId = $(this).closest('[id]').attr('id');
                var k = key;
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
                        $('#' + parentId + ' a.button-3d.close').trigger('click');
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
                        if ($('#' + parentId).attr('saved') === "true" && $('#' + parentId).attr('fileid') != 'undefined') {
                            self.newMail($('#' + parentId).attr('fileid'));
                        } else {
                            SystemUI.setDialogBox(parentId, 'Error', '1', 'Please save your file before you continue.');
                        }
                        break;
                    default:
                        console.log('Shouldnt');
                }
            },
            items: {
                new: {
                    name: "New",
                    accesskey: "O",
                    //className: "context-menu-bold",
                    icon: function(opt, $itemElement, itemKey, item) {
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<a class="b-new" aria-hidden="true"></a> <p><span class="context-menu-accesskey">N</span>ew</p>');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    }
                },
                open: {
                    name: "Open",
                    accesskey: "O",
                    //className: "context-menu-bold",
                    icon: function(opt, $itemElement, itemKey, item) {
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<a class="b-open" aria-hidden="true"></a> <p><span class="context-menu-accesskey">O</span>pen</p>');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    }
                },
                close: {
                    name: "Close",
                    accesskey: "C"
                },
                "sep1": "---------",
                save: {
                    name: "Save",
                    accesskey: "s",
                    //className: "context-menu-bold",
                    icon: function(opt, $itemElement, itemKey, item) {
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<a class="b-save" aria-hidden="true"></a> <p><span class="context-menu-accesskey">S</span>ave</p>');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    }
                },
                saveAs: {
                    name: "Save As",
                    accesskey: "A"
                },
                saveAsHtml: {
                    name: "Save As HTML",
                    accesskey: "H",
                    disabled: true
                },
                version: {
                    name: "Versions",
                    accesskey: "V",
                    disabled: true
                },
                "sep2": "---------",
                pageSet: {
                    name: "Page Setup",
                    accesskey: "u",
                    disabled: true
                },
                printPreview: {
                    name: "Print Preview",
                    accesskey: "v",

                    //className: "context-menu-bold",
                    icon: function(opt, $itemElement, itemKey, item) {
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<a class="b-preview" aria-hidden="true"></a> <p>Print Pre<span class="context-menu-accesskey">v</span>iew </p>');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    },
                    disabled: true
                },
                print: {
                    name: "Print",
                    accesskey: "P",
                    //className: "context-menu-bold",
                    icon: function(opt, $itemElement, itemKey, item) {
                        // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                        $itemElement.html('<a class="b-print" aria-hidden="true"></a> <p><span class="context-menu-accesskey">P</span>rint</p>');
                        // Add the context-menu-icon-updated class to the item
                        return 'context-menu-icon-updated';
                    }
                },
                "sep3": "---------",
                sendTo: {
                    name: "Send To",
                    accesskey: "T",
                    items: {
                        mail: {
                            name: "Mail Recipient",
                            accesskey: "M",
                            icon: function(opt, $itemElement, itemKey, item) {
                                // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                                $itemElement.html('<a class="b-mail" aria-hidden="true"></a> <p><span class="context-menu-accesskey">M</span>ail Recipient...</p>');
                                // Add the context-menu-icon-updated class to the item
                                return 'context-menu-icon-updated';
                            }
                        }
                    }
                },
                properties: {
                    name: "Properties",
                    accesskey: "r",
                    disabled: true
                },
                "sep4": "---------",
                exit: {
                    name: "Exit",
                    accesskey: "e"
                }
            }
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
            selector: '.notepad .menu-bar .file',
            //appendTo: '#word-1 > div.window-border > div.menu-bar.h-count > a.file',
            trigger: 'left',
            position: function(opt, x, y) {
                var a = this.offset();
                opt.$menu.css({
                    top: a.top + 10,
                    left: a.left - 10
                })
            },
            className: 'notepad-file-context-menu',
            callback: function(key, options) {
                var parentId = $(this).closest('[id]').attr('id');
                var k = key;
                switch (key) {
                    case "new":
                        $('#desktop-icon-5').trigger('dblclick');
                        break;
                    case "open":
                        //e.preventDefault();
                        self.showOpen(parentId);
                        break;
                    case "exit":
                        $('#' + parentId + ' a.button-3d.close').trigger('click');
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
                        console.log('Shouldnt');
                }
            },
            items: {
                new: {
                    name: "New",
                    accesskey: "O"
                },
                open: {
                    name: "Open",
                    accesskey: "O"
                },
                "sep1": "---------",
                save: {
                    name: "Save",
                    accesskey: "s"
                },
                saveAs: {
                    name: "Save As",
                    accesskey: "A"
                },
                "sep2": "---------",
                pageSet: {
                    name: "Page Setup",
                    accesskey: "u",
                    disabled: true
                },
                print: {
                    name: "Print",
                    accesskey: "P"
                },
                "sep3": "---------",
                exit: {
                    name: "Exit",
                    accesskey: "e"
                }
            }
        });
    }

}
class Explorer {
    constructor(processID, directory) {
        this.processID = processID;
        this.directory = directory;
        var a = this.create();
        return a;
    }
    create() {
        var a = this.append();
        return a;
    }
    append() {
        var e = kernel.getFileFromLocal('file-0000000000001');
        var iconURL = programData.getIconByType(e.type);
        var iconData = '<div class="folder-icon user-file" tabindex="0" fileID="' + e.fileID + '" program-name="' + e.program + '" type="' + e.extension + '" style="background:url(' + iconURL + ') no-repeat center top;background-size: 32px; "><p class="text" style="text-align:center;"><span>' + e.filename + '</span></p></div>';
        var b = this.getDirectoryContents();
        var explorerData = `<div id="explorer-${this.processID}" class="explorer window ui-widget-content" program-name="explorer" pid="${this.processID}" directory="${this.directory}">
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
        var a = $('#explorer-'+this.processID +' #explorer-content');
        $("#explorer-" + this.processID).resizable({
            alsoResize: a
        });
        return {
            windowID: '#explorer-'+ this.processID,
            description: 'My projects'
        };
    }
    getDirectoryContents(){
        //future
        return{
            title:'My Projects',
            location:'Desktop/My Projects',
            type:'folder'
        }
    }
}
class Notepad {
    constructor(processID, fileID) {
        this.fileID = fileID;
        this.processID = processID;
        var a = this.create();
        return a;
    }
    saveListener() {
        var doc = $('[pid="' + this.processID + '"] .document-wrap');
        var contents = $(doc).html();
        $(doc).blur(function() {
            if (contents != $(this).html()) {
                $(this).closest('div[pid]').attr('saved', false);
            }
        });

    }
    create() {
        this.a++;
        //let notepadID = 'notepad-' + processID;
        if (this.fileID) {
            //log(this.fileID);
            //var file = this.filename.split('.');
            var file = kernel.getFileFromLocal(this.fileID);
            var description = file.filename + ' - Notepad';
            var content = file.content;
            var filename = file.filename;
            var type = file.type;
        } else {
            var description = 'Untitled - Notepad';
            content = '<div class="clear"></div>';
            filename = 'Unitled';
            type = '';
        }
        var a = this.append(filename, content, type, description);
        this.saveListener();
        //SystemUI.setWindowPosition(a);
        return {
            windowID: a,
            description: description
        };
    }
    append(filename, content, type, description) {
        var cd = 'contenteditable="true"';
        var notepadData = `<div id="notepad-${this.processID}" class="notepad window ui-widget-content" pid="${this.processID}" program-name="notepad" fileID=${this.fileID} saved="true">
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
        var a = `#notepad-${this.processID}-content .document-content`;
        $("#notepad-" + this.processID).resizable({
            //alsoResize: a
        })
        $('#notepad-' + this.processID + ' #save').draggable({
            handle: '.title-bar',
            containment: "#desktop",
            scroll: false
        });
        $('#notepad-' + this.processID + ' #open').draggable({
            handle: '.title-bar',
            containment: "#desktop",
            scroll: false
        });
        return '#notepad-' + this.processID;
    }
}

class MsWord {
    constructor(processID, fileID) {
        this.a = 0;
        this.fileID = fileID;
        this.processID = processID;
        var a = this.create();
        this.toolbar();
        return a;

    }
    init() {}
    saveListener() {
        var doc = $('[pid="' + this.processID + '"] .document-wrap');
        var contents = $(doc).html();
        $(doc).blur(function() {
            if (contents != $(this).html()) {
                $(this).closest('div[pid]').attr('saved', false);
            }
        });

    }
    static execFontSize(size, unit) {
        var spanString = $('<span/>', {
            'text': document.getSelection()
        }).css('font-size', size + unit).prop('outerHTML');
        document.execCommand('insertHTML', false, spanString);
    }
    static selectHTML() {
        var sel;
        $('.document-wrap').blur();
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }
    toolbar() {
        $('.toolbar a').on('mousedown', function(e) {
            $('.document-wrap').blur();
            e.stopPropagation();
            var el = $(e.currentTarget);

            var cmd = el.data('cmd');
            if (!cmd) return;
            e.preventDefault();
            try {
                document.execCommand(cmd, false, null);
            } catch (e) {}
        });
        $("select").on('mousedown', function(e) {
            e.stopPropagation();
            if (e.target !== this)
                return
            range = MsWord.selectHTML();
        })
        $("select#fontSize").on('change', function(e) {
            var sel;
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
            e.stopPropagation();
            var value = this.value;
            //if (!cmd) return;
            //e.preventDefault();
            try {
                MsWord.execFontSize(value, "px");
            } catch (e) {
                console.log(e);
            }
        });

        $("select.selectPicker").on('change', function(e) {
            var el = $(e.currentTarget);
            var cmd = el.data('cmd');
            var value = this.value;
            if (!cmd) return;
            e.preventDefault();
            try {
                document.execCommand(cmd, false, value);
            } catch (e) {
                console.log(e);
            }
        });
        var range = null;
        $(".toolbar .b-paste").on('mousedown', function(e) {
            e.stopPropagation();
            document.execCommand("paste", false, null);
            //var clipboardText = clipboardData.getData('Text/html');
            //document.execCommand('insertHTML', false, null);
        });
        $(".toolbar .b-paste").on('mouseup', function(e) {
            //$(this).focus().execCommand("paste",false,null);

        });

        $('.toolbar .b-hilite').on('mousedown', function(e) {
            e.stopPropagation();
            $('.document-wrap').blur();
            if (e.target !== this)
                return
            $('.color-picker').css('display', 'none');
            $(this).children().css('display', 'block');

            range = MsWord.selectHTML();

        });
        $('.toolbar .b-hilite').on('mouseup', function(e) {
            e.stopPropagation();
            var sel;
            $('.document-wrap').blur();
            if (range) {

                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        });


        $('.toolbar .b-hilite .color-picker a').on('mousedown', function(e) {
            //e.stopPropagation();
            $('.document-wrap').blur();
            var color = $(this).css('background-color');
            $(this).closest('div').css('display', 'none');
            /*	$.getScript('js/forecolor.js', function() {
            		ColorizeSelection(color);
            	});*/
            try {
                document.execCommand('backColor', false, color);
            } catch (e) {
                console.log('No Support');
            }

            e.stopPropagation();
        });
        $('.toolbar .b-fontcolor').on('mousedown', function(e) {
            $('.document-wrap').blur();
            if (e.target !== this)
                return
            $('.color-picker').css('display', 'none');
            $(this).children().css('display', 'block');
            range = MsWord.selectHTML();
        })
        $('.toolbar .b-fontcolor').on('mouseup', function(e) {
            //e.stopPropagation();
            var sel;
            $('.document-wrap').blur();
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
            e.stopPropagation();
        });

        $('.toolbar .b-fontcolor .color-picker a').on('mousedown', function(e) {
            var color = $(this).css('background-color');
            $(this).closest('div').css('display', 'none');

            /*	$.getScript('js/forecolor.js', function() {
            		ColorizeSelection(color);
            	});*/
            try {
                document.execCommand('foreColor', false, color);
            } catch (e) {
                console.log('No Support');
            }
            e.stopPropagation();

        });
    }
    create() {
        this.a++;
        var docNumber = MsWord._wordNumberStore();
        let wordID = 'word-' + docNumber;
        if (this.fileID) {
            //log(this.fileID);
            //var file = this.filename.split('.');
            var file = kernel.getFileFromLocal(this.fileID);
            var description = file.filename + ' - Microsoft Word';
            var content = file.content;
            var filename = file.filename;
            var type = file.type;
        } else {
            var description = 'Document ' + docNumber + ' - Microsoft Word';
            content = '<div class="clear"></div>';
            filename = 'Document ' + docNumber;
            type = '';
        }
        var a = this.append(docNumber, filename, content, type, description);
        this.saveListener();
        //SystemUI.setWindowPosition(a);
        return {
            windowID: a,
            description: description
        };
    }
    static _wordNumberStore() {
        var num = JSON.parse(localStorage.getItem('docNumber'));
        var docNumber = completeArr(num);
        localStorage.setItem('docNumber', JSON.stringify(num));
        return docNumber;
    }
    static _wordNumberRemove(v) {
        v = parseInt(v);
        var num = JSON.parse(localStorage.getItem('docNumber'));
        var y = removeArr(num, v);
        localStorage.setItem('docNumber', JSON.stringify(num));
        return true;
    }
    append(docNumber, filename, content, type, description) {
            var cd = 'contenteditable="true"';
            if (this.fileID === 'file-0000000000001' || this.fileID === 'file-0000000000002') {
                cd = '';
                description = description + ' (Read Only)';
            }
            var docData =
                `<div id="word-${docNumber}" class="word window ui-widget-content" pid="${this.processID}" program-name="msword" document-number=${docNumber} fileID=${this.fileID} saved="true">
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
            var a = `#word-${docNumber}-content .document-content`;
            $("#word-" + docNumber).resizable({
                alsoResize: a
            })
            $('#word-' + docNumber + ' #save').draggable({
                handle: '.title-bar',
                containment: "#desktop",
                scroll: false
            });
            $('#word-' + docNumber + ' #open').draggable({
                handle: '.title-bar',
                containment: "#desktop",
                scroll: false
            });
            return '#word-' + docNumber;
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
    static remove(docNumber, callback) {
        var parentID = 'word-' + docNumber;
        var saved = $('#' + parentID).attr('saved');
        if (saved == 'false') {
            var wantToClose = SystemUI.setDialogBox(parentID, 'Microsoft Word', '4', 'Are you sure you want to close before exiting?');
            $("#" + parentID + " #dialog button").on('click', function() {
                $('#' + parentID).css('pointer-events', 'auto');
                var d = $(this).attr('value');

                if (d == "yes") {
                    MsWord._wordNumberRemove(docNumber);
                    callback(true);
                } else if (d == "no") {
                    callback(false);
                } else if (d == "cancel") {
                    callback(false);
                }
            });
        } else {
            MsWord._wordNumberRemove(docNumber);
            callback(true);
        }
    }
}
class Wolf3d {
    constructor(processID) {
        this.processID = processID;
        var a = this.create();
        return a;
    }
    create() {
        var a = this.append();
        return a;
    }
    append() {
        var wolfData = ` <div id="wolf" class="wolf window ui-widget-content" program-name="wolf-3d" style="display:block;" pid="${this.processID}">
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
        return {
            windowID: '#wolf',
            description: 'Wolf 3D'
        };
    }
}
class Winamp {
    constructor(processID) {
        this.processID = processID;
        var a = this.create();
        return a;
    }
    create() {
        var a = this.append();
        return a;
    }
    append() {
        var script;
        //var processID = this.processID;
        var winampData = `<div id='winamp2-js' class="winamp window" tabindex="-1" program-name="winamp" pid="${this.processID}"></div>
                    <script src="installed-programs/winamp2-js/built/winamp.js"></script>`;
        $(winampData).appendTo('#desktop').show('fast');
        $('#winamp2-js').draggable({
            handle: '.title-bar'
        });
        return {
            windowID: '#winamp2-js',
            description: 'Winamp Music Player'
        };
    }
}
class Minesweeper {
    constructor(processID) {
        this.processID = processID;
        var a = this.create();
        return a;
    }
    create() {
        var a = this.append();
        return a;
    }
    append() {
        var minesweeperData = ` <div id="minesweeper" class="window ui-widget-content" style="display:block;" program-name="minesweeper" pid = "${this.processID}">
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
class MailClient {
    constructor(processID) {
        //this.fileID = fileID;
        this.processID = processID;
        this.init();
        this.toolbar();
        var a = this.create();
        return a;
    }
    init() {}
    create() {
        var p = this.append();
        return p;
    }
    append(mailID) {
        var attachData;
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
        var mailID = 'mail-'+this.processID;
        var mailData = `<div id="mail-${this.processID}" class="mail window ui-widget-content" program-name="mail" style="display:block" pid="${this.processID}">
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
        var a = `#${mailID} .mail-content`;
        $("#mail" + mailID).resizable({
            alsoResize: a
        });
        $('#' + mailID + ' #attach').draggable({
            handle: '.title-bar'
        });
        return {
            windowID: '#mail-' + this.processID,
            description: 'Mail Client'
        };
    }
    toolbar() {
        $('.toolbar a').on('mousedown', function(e) {
            e.stopPropagation();
            var el = $(e.currentTarget);
            var cmd = el.data('cmd');
            if (!cmd) return;
            e.preventDefault();
            try {
                document.execCommand(cmd, false, null);
            } catch (e) {}
        });
        $("select#fontSize").on('change', function(e) {

            var value = this.value;
            //if (!cmd) return;
            //e.preventDefault();
            try {
                MsWord.execFontSize(value, "px");
            } catch (e) {
                console.log(e);
            }
        });

        $("select.selectPicker").on('change', function(e) {
            var el = $(e.currentTarget);
            var cmd = el.data('cmd');
            var value = this.value;
            if (!cmd) return;
            e.preventDefault();
            try {
                document.execCommand(cmd, false, value);
            } catch (e) {
                console.log(e);
            }
        });
        var range = null;
        $(".toolbar .b-paste").on('mousedown', function(e) {
            e.stopPropagation();
            document.execCommand("paste", false, null);
            //var clipboardText = clipboardData.getData('Text/html');
            //document.execCommand('insertHTML', false, null);
        });
        $(".toolbar .b-paste").on('mouseup', function(e) {
            //$(this).focus().execCommand("paste",false,null);

        });

        $('.toolbar .b-hilite').on('mousedown', function(e) {
            e.stopPropagation();
            if (e.target !== this)
                return
            $('.color-picker').css('display', 'none');
            $(this).children().css('display', 'block');
            range = MsWord.selectHTML();

        });
        $('.toolbar .b-hilite').on('mouseup', function(e) {
            e.stopPropagation();
            var sel;
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
        });


        $('.toolbar .b-hilite .color-picker a').on('mousedown', function(e) {
            //e.stopPropagation();
            var color = $(this).css('background-color');
            $(this).closest('div').css('display', 'none');
            /*	$.getScript('js/forecolor.js', function() {
            		ColorizeSelection(color);
            	});*/
            try {
                document.execCommand('backColor', false, color);
            } catch (e) {
                console.log('No Support');
            }

            e.stopPropagation();
        });
        $('.toolbar .b-fontcolor').on('mousedown', function(e) {

            if (e.target !== this)
                return
            $('.color-picker').css('display', 'none');
            $(this).children().css('display', 'block');
            range = MsWord.selectHTML();
        })
        $('.toolbar .b-fontcolor').on('mouseup', function(e) {
            //e.stopPropagation();
            var sel;
            if (range) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.selection && range.select) {
                    range.select();
                }
            }
            e.stopPropagation();
        });

        $('.toolbar .b-fontcolor .color-picker a').on('mousedown', function(e) {

            var color = $(this).css('background-color');
            $(this).closest('div').css('display', 'none');

            /*	$.getScript('js/forecolor.js', function() {
            		ColorizeSelection(color);
            	});*/
            try {
                document.execCommand('foreColor', false, color);
            } catch (e) {
                console.log('No Support');
            }
            e.stopPropagation();

        });

    }

}
class bot {
    constructor(el) {
        //super();
        this._el = el;
        this._agentDfd = null;
        this._agentEls = this._el.find('.characters a');
        this._setupEvents();
    }
    _setupEvents() {
        this._agentEls.click($.proxy(this._onAgentClick, this));

    }
    _onAgentClick(e) {
        var el = $(e.currentTarget);
        var name = el.data('item');
        if (!name) return;
        //this.switchAgent(name);
    }
    switchAgent(newAgent) {
        // remove current loading
        this._agentEls.removeClass('active');
        this._agentEls.removeClass('loading');
        this._agentName = newAgent;

        this._getAgentEl(newAgent).addClass('active')
            .addClass('loading');
        // console.log(this._agentDfd);
        $('.run-example').hide();
        this._clearActions();
        this._el.addClass('loading');


        if (this._agentDfd) {
            var dfd = $.Deferred();
            this.agent($.proxy(function(agent) {
                agent.hide(false, $.proxy(function() {
                    this._switchAgentInternal(newAgent).done(dfd.resolve);
                }, this))
            }, this));

            return dfd.promise();
        }

        return this._switchAgentInternal(newAgent);
    }
    _switchAgentInternal(newAgent) {

        this._agentDfd = $.Deferred();
        clippy.load(newAgent, $.proxy(this._onAgentReady, this));
        return this._agentDfd.promise();
    }


    _onAgentReady(agent) {
        this._agentDfd.resolve(agent);
        agent.show();
        this._getAgentEl(this._agentName).removeClass('loading');
        this._setupActions(agent);
        this._el.removeClass('loading');
        $('.run-example').show();
    }

    _getAgentEl(name) {
        return this._agentEls.filter('[data-item=' + name + ']');
    }

    _clearActions() {
        $('.actions-content').html('<span class="loading">Loading...</span> ');
    }

    _setupActions(agent) {
        var content = '';
        var animations = agent.animations().sort();

        for (var i = 0; i < animations.length; i++) {
            var a = animations[i];
            content += '<a class="action no-select" contenteditable="false" data-id="' + a + '">' + a + '</a>';
        }

        $('.actions-content').html(content);
    }

    play(animation, callback) {
        this.agent(function(a) {
            a.stop();
            a.play(animation, undefined, callback);
        })
    }

    speak(text) {
        this.agent(function(a) {
            a.speak(text);
        })
    }

    agent(func) {
        if (!this._agentDfd) return;
        var dfd = this._agentDfd;
        if ($.isFunction(func) && dfd) {
            dfd.done(func);
        }
        return dfd.promise();
    }

    isReady() {
        return this._agentDfd && this._agentDfd.isResolved && this._agentDfd.isResolved();
    }


    _onRunExampleClick(e) {
        var el = $(e.currentTarget);
        var key = el.data('key');
        if (!key) return;
        var f = this._exampleFuncs[key];
        if (!f) return;

        this.agent($.proxy(f, this));
    }

    // _exampleFuncs:{
    //     play:function (agent) {
    //         agent.stop();
    //         agent.play('Searching');
    //     },

    //     animate:function (agent) {
    //         agent.stop();
    //         agent.animate();
    //     },

    //     speak:function (agent) {
    //         agent.speak('When all else fails, bind some paper together. My name is Clippy.');
    //     },

    //     moveTo:function (agent) {
    //         agent.stop();
    //         agent.moveTo(100, 100);
    //     },

    //     gestureAt:function (agent) {
    //         agent.stop();
    //         agent.gestureAt(200, 200);
    //     },

    //     stopCurrent:function (agent) {
    //         agent.stopCurrent();
    //     },


    //     stop:function (agent) {
    //         agent.stop();
    //     }

    // }
}
class login {
    constructor() {
        //this.greetings();
        this.eventListeners();
        this.sound = new sound();
        this.login();
        //this.lols();
    }
    greetings() {
        /**
         * Sound
         */
        globalBot.speak('Hi, welcome to a recreation of Windows 98 on the web. I am Clippy and I am going to help you around this site.')
        if (isFirstLogin()) {
            globalBot.agent(function(a) {
                a.speak('This website allows you to relive Windows 98 in a browser. You can login using your own username after logging out.')
                setTimeout(function() {
                    a.moveTo(250, 250);
                    a.gestureAt(50, 250);
                    a.speak('Start here');
                }, 10000)
            });
        }
        // setTimeout(function() {
        //     globalBot.speak('To login, type in ANY username and click OK. Sound is muted, to unmute it please click the sound icon at anytime');
        // }, 9000);


    }
    eventListeners() {
            var self = this;
            $('#login').off().on('click', '.close,.cancel', function() {
                self.login();
            })
            $('#login').off().on('click', '.ok-button', function(e) {
                e.stopPropagation();
                e.preventDefault();
                self.login();
            })
            $('.audio-button').off().on('click', function() {
                $('.audio-button').toggleClass('mute');
                sound.toggleSound();
            })
            $(window).load(function() {
                self.greetings();
            });
        }
        /**
         * {
          "users": [
            {
              "username": "",
              "creationDate": {},
              "lastLogin": {},
              "files": [
                {
                 "fileID": "",
        		"filename": "",
        		"content": "",
        		"type": "",
        		"creationDate": "",
        		"modifiedDate": ""
                }
              ],
              "displayname": {},
              "pref": [{
        		"sound": ""
        		"background": ""
        		}],
              "email": ""
            },
            {
              "username": "",
              "creationDate": {},
              "lastLogin": {},
              "files": [
                {
                  "filename": "",
                  "content": "",
                  "type": ""
                },
                {
                  "filename": "",
                  "content": "",
                  "type": ""
                }
              ],
              "displayname": {},
              "pref": "",
              "email": ""
            }
          ]
        }
         */
    login() {
        var username = $('#username').val() || 'Rahul';
        if (Modernizr.localstorage) {
            var users = localStorage.getItem('users');
            if (users !== null) {
                if (this.userExists(username)) {
                    this.setExistingUser(username);
                } else {
                    this.addNewUser(username);
                }
            } else {
                this.firstVisit();
                this.addNewUser(username);
            }
            this.setup();
        } else {
            console.log('No Storage');
            $('#login').css('display', 'none');
            $('#desktop').css('display', 'block');
            sound.play('sprite8');
        }
    }
    userExists(username) {
        var users = JSON.parse(localStorage.getItem('users'));
        var a = false;
        $.each(users.users, function() {
            if (this.username === username) {
                a = true;
                return false
            }
        })
        return a;
    }
    addNewUser(username) {
        var users = JSON.parse(localStorage.getItem('users'));
        var userObj = {
            "username": username,
            "creationDate": Date.now(),
            "lastLogin": Date.now(),
            "files": [],
            "displayname": username,
            "pref": {
                "sound": !($('.audio-button').hasClass('mute')),
                "background": ""
            },
            "email": ""
        };
        userObj.files.push({
            'fileID': 'file-0000000000001',
            'filename': 'My Details',
            'content': `<span style="font-size: 20px;">RAHUL MEHRA<br></span><div style="padding: 0px; margin: -3px;"><br></div><div style="line-height: 21px; border: 1px solid; padding: 4px;"><b>Location:&nbsp;</b>Australia.&nbsp;<b>E-Mail:</b>&nbsp;<a href="mailto:rahulmehra@techgeek.co.in">rahulmehra@techgeek.co.in</a>&nbsp;<b>GIT:</b>&nbsp;<a href="https://github.com/lolstring">https://github.com/lolstring</a>&nbsp;<br></div><div style="line-height: 21px;"><br></div><div>PROJECTS</div><div><p><b>Mycroft.AI Gnome shell extension and KDE plasmoid (open-source)</b></p><ul><li><b><span lang="EN-US" style="line-height: 12.36px;">Gnome-shell based on:</span></b><span lang="EN-US" style="line-height: 12.36px;">&nbsp;GJS (Spider-monkey), CSS.</span></li><ul><li><span lang="EN-US" style="line-height: 12.36px;"><b>Link:</b>&nbsp;<a href="https://extensions.gnome.org/1197/mycroft-assistant/">https://extensions.gnome.org/1197/mycroft-assistant</a></span></li></ul><li><b>KDE plasmoid based on:</b>&nbsp;QML 2.0, KDE Framework 5.&nbsp;</li><ul><li><b>Link:</b>&nbsp;<a href="https://cgit.kde.org/plasma-mycroft.git/">https://cgit.kde.org/plasma-mycroft.git</a></li></ul><li>Created a native extension and plasmoid for the Mycroft AI assistant on GNOME and KDE desktop environments.</li><ul><li>Designed and developed similar front-end GUI on both desktop environments</li><li>Connected the system with Mycroft-core web socket.</li><li>Handled release for gnome extension and got it approved on&nbsp;<a href="https://extensions.gnome.org/">https://extensions.gnome.org</a></li></ul></ul><b>Rahul.io</b></div><div><ul><li><b><b>Link:&nbsp;</b><a href="https://rahul.io/" style="font-weight: normal;">https://rahul.io</a><br></b></li><li><b>Based on:</b>&nbsp;HTML5, JavaScript ES6 Babel, CSS3, jQuery.</li><li>Created a Front-end Microsoft Windows 98 GUI in the browser using JavaScript ES6, jQuery and CSS3.</li><ul><li>Used a reference and mimicked the GUI properties of the operating system.</li><li>Recreated Icons and system code structure for future added program.</li><li>Incorporated Wolf3d and Minesweeper from open source developers into the OS as programs.</li></ul></ul><ul></ul></div><div><p><b>Tisya Jewels</b></p><ul><li><b><b>Link:&nbsp;</b><a href="https://tisyajewels.com/" style="font-weight: normal;">http://tisyajewels.com</a><br></b></li><li><b>Based on:</b>&nbsp;HTML5, JavaScript, CSS, PHP5, WordPress&nbsp;</li><li>Overview: Create a website for a Jewelry company to showcase their products.&nbsp;<br></li><ul><li>Develop and Redesign previous website based on WordPress.</li><li>Create logo and assets and UI/UX for the website.&nbsp;<br></li></ul></ul><ul></ul><p><b>Banayega.com&nbsp;</b><b>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</b></p><ul><li><b><b>Link:</b><span style="font-weight: normal;">&nbsp;</span><a href="https://banayega.com/" style="font-weight: normal;">https://banayega.com</a><br></b></li><li><b>Based on:</b>&nbsp;HTML5, JavaScript, CSS, PHP5, WordPress.&nbsp;</li><li>Banayega.com is a company that allows creates a marketplace and drop shipping hub for personalised products for consumers and companies for gifting.</li><ul><li>Create front-end and backend systems and modules for consumers and drop shippers using WordPress.</li><li>Designed an admin/reseller portal for stock, supply and resellers using MEAN.</li><li>Managerial Duties such as team management and coordination between all areas of business.&nbsp;</li><li>Develop new partnerships and manage various company accounts.&nbsp;&nbsp;<br></li></ul></ul><p><b>Dial a Dress</b><b>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</b></p><p></p><ul><li><b>Based on:</b>&nbsp;HTML5, php5, CSS, JavaScript, MySQL, and Presto.</li><li>Overview: Develop a Website for renting out clothes to Customer.&nbsp;</li><ul><li>Create an entire backend system and module to be used with Presto for renting&nbsp;environment.</li><li>Design a User Interface and develop in accordance to User Interface Requirements</li><li>Create a tracking system with Google Maps along with an Inventory system&nbsp;</li><li>Create Older System Workings Report and Show Improvements&nbsp;&nbsp;<br></li></ul></ul><p><b>Audio Modulation and Analysis &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</b></p><p></p><ul><li><b>Based on:</b>&nbsp;Python (2.7) with Tkinter, Matplotlib, Scikits AudioLab, and PmwMegaWidgets.</li><li>Overview: Showcase and create a Multimedia Application for Audio Modulation and its analysis.</li><ul><li>Create a robust GUI using Tkinter and PmwMegaWidgets.</li><li>Implement Matplotlib to analyze the audio file.</li><li>Allow Comparison between two audio files in form of images and modulated output.</li></ul></ul><p><b>Business Dynamics</b></p><ul><li><b><b>Link:&nbsp;</b><a href="http://businessdynamics.in/" style="font-weight: normal;">http://businessdynamics.in</a><br></b></li><li><b>Based on:</b>&nbsp;HTML, CSS, JavaScript&nbsp;<br></li><li>Overview: Build a website to showcase features of the company and their product line.&nbsp;<br></li><ul><li>Develop Website and UX Interface.</li><li>Come up with content on webpages.</li><li>Update website with chat interface.&nbsp;<br><br></li></ul></ul></div><hr style="border-style: solid; border-color: black; border-image: initial;"><div><div>COMPUTER&nbsp;PROFICIENCY</div><div><ul><li><b>Stacks:</b>&nbsp;MEAN (MongoDB, ExpressJS, AngularJS 1.X, NodeJS), LAMP/LEMP (Linux, Apache, Nginx, MySQL, PHP5/Python).&nbsp;<br></li><li><b>Web Application Development:&nbsp;</b>HTML4/5, JavaScript ES 7/6/5, Babel, CSS2/3, AngularJS 1.X, JQuery, SocketIO, ExpressJS, PHP, Python(django), NodeJS.<br></li><li><b>Databases:</b>&nbsp;NoSQL, MongoDB, MySQL, Microsoft SQL, Oracle Warehousing, PostgreSQL, GraphDB.<br></li><li><b>Application Development Languages, Scripting:</b>&nbsp;XML, JSON, Shell Scripting, C, C++, C#, Python, PHP5, GJS(gnome)</li><li><b>Frameworks and Architectures:</b>&nbsp;Gulp, Grunt, Drupal, WordPress, Presto, Kali Framework.&nbsp;</li><li><b>Deployment Environments and Servers:</b>&nbsp;Git, Apache SVN, Docker, Nginx, Apache, NodeJS, Apache Tomcat.&nbsp;</li><li><b>Commercial Services:</b>&nbsp;Personal Server, Amazon Web Services(AWS), Heroku, Digital Ocean, Google App Engine, Azure.</li></ul></div><div><br></div></div><div><br></div><div><br></div>
                      <div class="clear"></div>`,
            'type': 'doc',
            'program': 'msword',
            'creationDate': 1476970200000,
            'modifiedDate': 1476970200000,
        })
        userObj.files.push({
            'fileID': 'file-0000000000002',
            'filename': 'License and Credits',
            'content': `
<h3> License </h3><br>
<br>
The Windows 98 name, interface, and sample audio files are a property of
Microsoft Corporation, the code within this project is released under the [MIT
License].<br>
<br>
The MIT License (MIT)<br>
<br>
Copyright (c) [2016-2017] [Rahul Mehra]<br>
<br>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br>
<br>
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br>
<br>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.<br>
<br>
<h3>Credits :</h3> <br>

Wolf3d - https://github.com/jseidelin/wolf3d<br>
Clippy - https://github.com/smore-inc/clippy.js<br>
Winamp2 - https://github.com/captbaritone/winamp2-js<br>
<br>
Please see their respective licenses.
`,
            'type': 'doc',
            'program': 'msword',
            'creationDate': 1476970200000,
            'modifiedDate': 1476970200000
        })
        users.users.push(userObj)
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(userObj));
    }
    setExistingUser(username) {
        var users = JSON.parse(localStorage.getItem('users'));
        var currentUser;
        $.each(users.users, function(k, v) {
            if (this.username === username) {

                this.lastLogin = Date.now();
                this.pref.sound = !($('.audio-button').hasClass('mute'));
                currentUser = v;
                return false;
            }
        });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    firstVisit() {
        var userObj = {
            "users": []
        };
        localStorage.setItem('users', JSON.stringify(userObj));
        return true;
    }
    setup() {
        //log('called1');
        var k = new kernel();
        k.store();

        var ui = new SystemUI();
        ui.init();
        ui.eventListeners();
        ui.setDesktop();
        $('#login').css('display', 'none');
        $('#desktop').css('display', 'block');
        if (!($('.audio-button').hasClass('mute'))) {
            $('#clock > .volume').attr('src', 'images/win98_icons/volume.ico');
        } else {
            $('#clock > .volume').attr('src', 'images/win98_icons/volumemute.ico');
        }
        sound.play('sprite8');
    }
    loaded() {
        $(window).load(function() {
            return true;
        });
    }
}
class sound {
    constructor() {
        var self = this;
        var options = {
            urls: ["../sounds/combinedSound.ogg", "../sounds/combinedSound.m4a", "../sounds/combinedSound.mp3", "../sounds/combinedSound.ac3"],
            sprite: {
                CHIMES: [0, 631.3378684807255],
                CHORD: [2000, 1098.9115646258504],
                DING: [5000, 915.6916099773244],
                LOGOFF: [7000, 3549.0249433106574],
                NOTIFY: [12000, 1352.5170068027207],
                RECYCLE: [15000, 574.6485260770982],
                START: [17000, 45.89569160997797],
                TADA: [19000, 1938.866213151929],
                TMS: [22000, 7858.503401360544]
            },
            spriteMap: {
                sprite0: 'CHIMES',
                sprite1: 'CHORD',
                sprite2: 'DING',
                sprite3: 'LOGOFF',
                sprite4: 'NOTIFY',
                sprite5: 'RECYCLE',
                sprite6: 'START',
                sprite7: 'TADA',
                sprite8: 'TMS'
            }
        }
        self.sounds = [];
        // Setup the options to define this sprite display.
        // self._width = options.width;
        // self._left = options.left;
        self._spriteMap = options.spriteMap;
        self._sprite = options.sprite;
        self.sound = new Howl({
            src: options.urls,
            sprite: options.sprite
        });
        //self.loginEventListeners(true);
    }
    static toggleSound(enable) {
        var user = JSON.parse(localStorage.getItem('currentUser'));
        user.pref.sound = !($('.audio-button').hasClass('mute'));
        localStorage.setItem('currentUser', JSON.stringify(user));
        if ($('.window[program-name="wolf-3d"]').length != 0) {
            if (!($('.audio-button').hasClass('mute'))) {
                console.log('Sound Enabled');
                document.getElementById('wolf-frame').contentWindow.Wolf.Sound.toggle("enable");
            } else {
                console.log('Sound Disabled');
                document.getElementById('wolf-frame').contentWindow.Wolf.Sound.toggle();
            }
        }
        // if($('.window[program-name="wolf-3d"]').length != 0) {
        // 			document.getElementById('wolf-frame').contentWindow.Wolf.Sound.toggle();
        // }
    }
    static play(key) {
        var self = this;
        if (JSON.parse(localStorage.getItem('currentUser')).pref.sound === true) {
            var options = {
                urls: ["../sounds/combinedSound.ogg", "../sounds/combinedSound.m4a", "../sounds/combinedSound.mp3", "../sounds/combinedSound.ac3"],
                sprite: {
                    CHIMES: [0, 631.3378684807255],
                    CHORD: [2000, 1098.9115646258504],
                    DING: [5000, 915.6916099773244],
                    LOGOFF: [7000, 3549.0249433106574],
                    NOTIFY: [12000, 1352.5170068027207],
                    RECYCLE: [15000, 574.6485260770982],
                    START: [17000, 45.89569160997797],
                    TADA: [19000, 1938.866213151929],
                    TMS: [22000, 7858.503401360544]
                },
                spriteMap: {
                    sprite0: 'CHIMES',
                    sprite1: 'CHORD',
                    sprite2: 'DING',
                    sprite3: 'LOGOFF',
                    sprite4: 'NOTIFY',
                    sprite5: 'RECYCLE',
                    sprite6: 'START',
                    sprite7: 'TADA',
                    sprite8: 'TMS'
                }
            }
            self.sounds = [];
            // Setup the options to define this sprite display.
            // self._width = options.width;
            // self._left = options.left;
            self._spriteMap = options.spriteMap;
            self._sprite = options.sprite;
            self.sound = new Howl({
                src: options.urls,
                sprite: options.sprite
            });
            var self = this;
            var sprite = self._spriteMap[key];

            // Play the sprite sound and capture the ID.
            var id = self.sound.play(sprite);
        } else {
            //log('No sound');
        }
    }
}

function main() {
    var l = new login();

    //ui.windowInitalPositionValues();
}
var globalBot = new bot($('body'));
globalBot.switchAgent('Clippy');
main();
startTime();

function isFirstLogin() {
    var a = JSON.parse(localStorage.getItem('currentUser'));
    if (a.creationDate === a.lastLogin) {
        return true;
    } else {
        return false;
    }
}