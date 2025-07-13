// @ts-nocheck
import $ from 'jquery';

(($) => {
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
})($);

$.fn.setInitialIcons = function (options) {

  const newOptions = $.extend({
    selector: '.desktop-icon[program-name!="recyclebin"]',
    marginTop: 26,
    marginLeft: 0
  }, options);

  return this.each(function () {

    const $container = $(this);
    const $icons = $(newOptions.selector, $container);
    const containerHeight = $(window).height();
    const iconHeight = $($icons[0]).height();
    const iconWidth = $($icons[0]).width();
    const numberFit = Math.floor(containerHeight / (iconHeight + newOptions.marginTop));
    let top = 0;
    let left = 0;
    $icons.each(function (i) {
      if (i % numberFit === 0 && i > 0) {
        top = 0;
        left += iconWidth + newOptions.marginLeft + 4;
      }
      $(this).css({
        top: top,
        left: left + newOptions.marginLeft
      });
      top += iconHeight + newOptions.marginTop;
    });
  });
};