export function completeArr(arr: number[]): number {
  let number = 0;
  loop1:
  for (let i = 1; i < arr.length; i++) {
    for (let j = 1 + arr[i - 1]; j < arr[i]; j++) {

      number = j;
      if (number > 0) {
        break loop1;
      }
    }
  }
  if (number === 0 || !(Number.isInteger(number))) {
    return incrementArr(arr);
  }
  arr.push(number);
  arr.sort();
  return number;
}

export function incrementArr(arr: number[]): number {
  arr[arr.length] = arr.length + 1;
  return arr[arr.length - 1];
}

export function removeArr(arr: number[], v: number): boolean {
  const index = arr.indexOf(v);
  Array.isArray(arr);
  if (index > -1) {
    arr.splice(index, 1);
    return true;
  }
}


export const toType = (obj) => ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
//Clock//

export function startTime() {
  const today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  m = checkTime(m);
  const suffix = h >= 12 ? "PM" : "AM";
  h = ((h + 11) % 12 + 1);
  $('#clock .text').html(`${h}:${m} ${suffix}`);
  setTimeout(startTime, 1000);
}

export function checkTime(i) {
  let t = i;
  if (i < 10) {
    t = `0${i}`
  }; // add zero in front of numbers < 10
  return t;
}

//Universal Logger
export function log(e) {
  console.log(e);
}

export function isFirstLogin() {
  const a = JSON.parse(localStorage.getItem('currentUser'));
  if (a.creationDate === a.lastLogin) {
    return true;
  }
  return false;
}