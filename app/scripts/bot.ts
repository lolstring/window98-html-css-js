import clippy from "../installed-programs/clippy/build/clippy";
import $ from "jquery";

export class Bot {
  _el: JQuery<HTMLElement>;
  _agentDfd: JQuery.Deferred<any> | null;
  _agentEls: JQuery<HTMLElement>;
  _agentName: string | null;
  _exampleFuncs: { [key: string]: (agent) => void };

  constructor(el: JQuery<HTMLElement>) {
    this._el = el;
    this._agentDfd = null;
    this._agentEls = this._el.find(".characters a");
    this._exampleFuncs = this._initExampleFuncs();
    this._setupEvents();
  }

  _setupEvents(): void {
    this._agentEls.on("click", $.proxy(this._onAgentClick, this));
  }

  _onAgentClick(e: JQuery.ClickEvent): void {
    const el = $(e.currentTarget);
    const name = el.data("item");
    if (!name) return;
    //this.switchAgent(name);
  }

  switchAgent(newAgent: string): JQuery.Promise<any> {
    this._agentEls.removeClass("active");
    this._agentEls.removeClass("loading");
    this._agentName = newAgent;

    this._getAgentEl(newAgent).addClass("active").addClass("loading");
    $(".run-example").hide();
    this._clearActions();
    this._el.addClass("loading");

    if (this._agentDfd) {
      const dfd = $.Deferred();
      this.agent(
        $.proxy(function (agent) {
          agent.hide(
            false,
            $.proxy(function () {
              this._switchAgentInternal(newAgent).done(dfd.resolve);
            }, this),
          );
        }, this),
      );
      return dfd.promise();
    }

    return this._switchAgentInternal(newAgent);
  }

  _switchAgentInternal(newAgent: string): JQuery.Promise<any> {
    this._agentDfd = $.Deferred();
    clippy.load(newAgent, $.proxy(this._onAgentReady, this));
    return this._agentDfd.promise();
  }

  _onAgentReady(agent): void {
    if (this._agentDfd) this._agentDfd.resolve(agent);
    agent.show();
    if (this._agentName) {
      this._getAgentEl(this._agentName).removeClass("loading");
    }
    this._setupActions(agent);
    this._el.removeClass("loading");
    $(".run-example").show();
  }

  _getAgentEl(name: string): JQuery<HTMLElement> {
    return this._agentEls.filter(`[data-item=${name}]`);
  }

  _clearActions(): void {
    $(".actions-content").html('<span class="loading">Loading...</span> ');
  }

  _setupActions(agent): void {
    let content = "";
    const animations = agent.animations().sort();

    for (let i = 0; i < animations.length; i++) {
      const a = animations[i];
      content += `<a class="action no-select" contenteditable="false" data-id="${a}">${a}</a>`;
    }

    $(".actions-content").html(content);
  }

  play(animation: string, callback?: () => void): void {
    this.agent((a) => {
      a.stop();
      a.play(animation, undefined, callback);
    });
  }

  speak(text: string): void {
    this.agent((a) => {
      a.speak(text);
    });
  }

  agent(func: (a) => void): JQuery.Promise<any> | undefined {
    if (!this._agentDfd) return;
    const dfd = this._agentDfd;
    if ($.isFunction(func) && dfd) {
      dfd.done(func);
    }
    return dfd.promise();
  }

  isReady(): boolean {
    return this._agentDfd?.state() === "resolved";
  }

  _onRunExampleClick(e: JQuery.ClickEvent): void {
    const el = $(e.currentTarget);
    const key = el.data("key");
    if (!key) return;
    const f = this._exampleFuncs[key];
    if (!f) return;

    this.agent($.proxy(f, this));
  }

  _initExampleFuncs(): { [key: string]: (agent) => void } {
    return {
      play: (agent) => {
        agent.stop();
        agent.play('Searching');
      },

      animate: (agent) => {
        agent.stop();
        agent.animate();
      },

      speak: (agent) => {
        agent.speak('When all else fails, bind some paper together. My name is Clippy.');
      },

      moveTo: (agent) => {
        agent.stop();
        agent.moveTo(100, 100);
      },

      gestureAt: (agent) => {
        agent.stop();
        agent.gestureAt(200, 200);
      },

      stopCurrent: (agent) => {
        agent.stopCurrent();
      },

      stop: (agent) => {
        agent.stop();
      }
    };
  }
}