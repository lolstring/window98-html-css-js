
$.fn.setInitialIcons = function (options) {

  options = $.extend({
    selector: '.desktop-icon[program-name!="recyclebin"]',
    marginTop: 26,
    marginLeft: 0
  }, options);

  return this.each(function () {

    var $container = $(this),
      $icons = $(options.selector, $container),
      containerHeight = $(window).height(),
      iconHeight = $($icons[0]).height(),
      iconWidth = $($icons[0]).width(),
      numberFit = Math.floor(containerHeight / (iconHeight + options.marginTop)),
      top = 0,
      left = 0;
    $icons.each(function (i) {
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