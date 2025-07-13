import db from './storage';

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
  if (Array.isArray(arr)) {
    if (index > -1) {
      arr.splice(index, 1);
      return true;
    }
  }
  return false;
}

//Clock//
export function startTime(): void {
  const today = new Date();
  const h = today.getHours();
  const m = today.getMinutes();

  const formattedM = checkTime(m);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayH = ((h + 11) % 12 + 1);
  
  $('#clock .text').html(`${displayH}:${formattedM} ${suffix}`);
  
  setTimeout(startTime, 1000);
}

export function checkTime(i: number): string | number {
  let t = `${i}`;
  if (i < 10) {
    t = `0${i}`
  }; // add zero in front of numbers < 10
  return t;
}

//Universal Logger
export function log(e: any): void {
  console.log(e);
}

export async function isFirstLogin(): Promise<boolean> {
  const currentUser = await db.users.filter((obj)=>obj.current === true).first();
  if (!currentUser || currentUser.creationDate === currentUser.lastLogin) {
    return true;
  }
  return false;
}

export function parseNumber(str: string | undefined): number {
  if (str === undefined) {
    throw new Error("Input string is undefined");
	}
  const num = Number.parseInt(str, 10);
  if (Number.isNaN(num)) {
    throw new Error("Invalid number");
  }
  return num;
}
export function findNearestPid(this: any): string | undefined {
  return $(this).closest("[pid]").attr("pid");
}
export function findNearestId(this: any): string | undefined {
  return $(this).closest("[id]").attr("id");
}
export function getWindowDimensions() {
  const htmlElement = document.querySelector('html');
  if (!htmlElement) return { width: 800, height: 600 };
  const width = htmlElement.clientWidth || 800;
  const height = htmlElement.clientHeight || 600;
  return { width, height };
}

