import Webamp from "webamp/lazy";

export class Winamp {
  constructor(processID) {
    this.processID = processID;
    const { windowID, description } = this.create();
    this.windowID = windowID;
    this.description = description;
  }
  create() {
    const webamp = new Webamp({
      initialTracks: [],
      windowLayout: {
        main: {
          position: {
            x: 100,
            y: 100,
          }
        },
        playlist: {
          position: {
            x: 100,
            y: 200,
          }
        },
        equalizer: {
          position: {
            x: 100,
            y: 300,
          }
        },
        milkdrop: {
          position: {
            x: 200,
            y: 100,
          }
        }
      }
    });
    const a = this.append(webamp);
    return a;
  }
  append(webamp) {
    const winampData = `<div id='winamp2-js' class="winamp window" tabindex="-1" program-name="winamp" pid="${this.processID}"></div>`;
    $(winampData).appendTo('#desktop').show('fast');
    webamp.renderWhenReady(document.getElementById('winamp2-js'));
    $('#winamp2-js').draggable({
      handle: '.title-bar'
    });
    return {
      windowID: '#winamp2-js',
      description: 'Winamp Music Player'
    };
  }
}