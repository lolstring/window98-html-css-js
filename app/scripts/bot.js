import clippy from "../vendor/clippy/build/clippy";
export class bot {
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
    const el = $(e.currentTarget);
    const name = el.data('item');
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
      const dfd = $.Deferred();
      this.agent($.proxy(function (agent) {
        agent.hide(false, $.proxy(function () {
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
    return this._agentEls.filter(`[data-item=${name}]`);
  }

  _clearActions() {
    $('.actions-content').html('<span class="loading">Loading...</span> ');
  }

  _setupActions(agent) {
    let content = '';
    const animations = agent.animations().sort();

    for (let i = 0; i < animations.length; i++) {
      const a = animations[i];
      content += `<a class="action no-select" contenteditable="false" data-id="${a}">${a}</a>`;
    }

    $('.actions-content').html(content);
  }

  play(animation, callback) {
    this.agent((a) => {
      a.stop();
      a.play(animation, undefined, callback);
    })
  }

  speak(text) {
    this.agent((a) => {
      a.speak(text);
    })
  }

  agent(func) {
    if (!this._agentDfd) return;
    const dfd = this._agentDfd;
    if ($.isFunction(func) && dfd) {
      dfd.done(func);
    }
    return dfd.promise();
  }

  isReady() {
    return this._agentDfd?.isResolved?.();
  }


  _onRunExampleClick(e) {
    const el = $(e.currentTarget);
    const key = el.data('key');
    if (!key) return;
    const f = this._exampleFuncs[key];
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