export function completeArr(arr) {
  let number = 0;
  var isComplete = false;
  loop1:
  for (var i = 1; i < arr.length; i++) {
    for (let j = 1 + arr[i - 1]; j < arr[i]; j++) {

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

export function incrementArr(arr) {
  return arr[arr.length] = arr.length + 1;
}

export function removeArr(arr, v) {
  var index = arr.indexOf(v);
  Array.isArray(arr);
  if (index > -1) {
    arr.splice(index, 1);
    return true;
  }
}


export var toType = (obj) => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
//Clock//

export function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  m = checkTime(m);
  var suffix = h >= 12 ? "PM" : "AM";
  h = ((h + 11) % 12 + 1);
  $('#clock .text').html(h + ':' + m + ' ' + suffix);
  var t = setTimeout(startTime, 1000);
}

export function checkTime(i) {
  if (i < 10) {
    i = "0" + i
  }; // add zero in front of numbers < 10
  return i;
}

//Universal Logger
export function log(e) {
  console.log(e);
}

export function isFirstLogin() {
  var a = JSON.parse(localStorage.getItem('currentUser'));
  if (a.creationDate === a.lastLogin) {
    return true;
  } else {
    return false;
  }
}