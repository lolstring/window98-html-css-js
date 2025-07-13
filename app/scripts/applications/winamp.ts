import Webamp from "webamp/lazy";
import { Application, type ApplicationConstruct } from './application';

export class Winamp extends Application {
  create(): ApplicationConstruct {
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

    const construct = this.append(webamp);
    this.windowID = construct.windowID;
    this.description = construct.description;
    return construct;
  }
  
  append(webamp: Webamp): ApplicationConstruct {
    const winampData = `<div id='winamp2-js' class="winamp window" tabindex="-1" program-name="winamp" pid="${this.processID}"></div>`;
    $(winampData).appendTo('#desktop').show('fast');
    const winampElement = document.getElementById('winamp2-js');
    if (winampElement) {
      webamp.renderWhenReady(winampElement);
    }
    $('#winamp2-js').draggable({
      handle: '.title-bar'
    });
    return {
      windowID: '#winamp2-js',
      description: 'Winamp Music Player'
    };
  }
}