Array.prototype.inArray = function (comparer) {
  for (let i = 0; i < this.length; i++) {
    if (comparer(this[i])) return true;
  }
  return false;
};
/* 
Adds an element to the array if 
it does not already exist using a comparer function
*/
Array.prototype.pushIfNotExist = function (element, comparer) {
  if (!this.inArray(comparer)) {
    this.push(element);
    this.sort();
  }
};
Array.prototype.contains = function (obj) {
  let i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

jQuery.cachedScript = (url, options) => {

  // Allow user to set any option except for dataType, cache, and urlp
  const newOptions = $.extend(options || {}, {
    dataType: "script",
    cache: false,
    url: url
  });

  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax(newOptions);
};