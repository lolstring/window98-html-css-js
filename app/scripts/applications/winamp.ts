import Webamp from "webamp/lazy";
import { Application } from './application';

export class Winamp extends Application {
  constructor(processID) {
    super(processID);
    const { windowID, description } = this.create();
    this.windowID = windowID;
    this.description = description;
  }
  create() {
    const webamp = new Webamp({
      initialTracks: [
                {
                  metaData: {
                    artist: "DJ Mike Llama",
                    title: "Llama Whippin' Intro",
                  },
                  // NOTE: Your audio file must be served from the same domain as your HTML
                  // file, or served with permissive CORS HTTP headers:
                  // https://docs.webamp.org/docs/guides/cors
                  url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
                  duration: 5.322286,
                },
                {
                  metaData: {
                    artist: "Some Artist",
                    title: "Title of Second Track",
                  },
                  url: "https://cdn.jsdelivr.net/gh/captbaritone/webamp@43434d82cfe0e37286dbbe0666072dc3190a83bc/mp3/llama-2.91.mp3",
                  duration: 5.322286,
                },
              ],
              requireJSZip: () => Promise.resolve(),
              requireMusicMetadata: () => Promise.resolve(),
    });
    return this.append(webamp);
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