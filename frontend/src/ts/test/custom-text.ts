import * as TribeState from "../tribe/tribe-state";
import * as TribeConfigSyncEvent from "../observables/tribe-config-sync-event";

export let text = [
  "The",
  "quick",
  "brown",
  "fox",
  "jumps",
  "over",
  "the",
  "lazy",
  "dog",
];
export let isWordRandom = false;
export let isTimeRandom = false;
export let isSectionRandom = false;
export let word = -1;
export let time = -1;
export let section = -1;
export let delimiter = " ";
export let popupTextareaState = "The quick brown fox jumps over the lazy dog";

export function setPopupTextareaState(value: string): void {
  popupTextareaState = value;
}

export function setText(txt: string[], tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  text = txt;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function getText(): string {
  return text.join(" ");
}

export function getTextArray(): string[] {
  return text;
}

export function setIsWordRandom(val: boolean, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  isWordRandom = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function setIsTimeRandom(val: boolean, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  isTimeRandom = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function setIsSectionRandom(val: boolean): void {
  isSectionRandom = val;
}

export function setTime(val: number, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  time = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function setWord(val: number, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  word = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

export function setSection(val: number): void {
  section = val;
}

export function setDelimiter(val: string, tribeOverride = false): void {
  if (!TribeState.canChangeConfig(tribeOverride)) return;
  delimiter = val;
  if (!tribeOverride) TribeConfigSyncEvent.dispatch();
}

type CustomTextObject = Record<string, string>;

type CustomTextLongObject = Record<string, { text: string; progress: number }>;

export function getCustomText(name: string, long = false): string[] {
  if (long) {
    const customTextLong = getLocalStorageLong();
    const customText = customTextLong[name];
    if (customText === undefined)
      throw new Error(`Custom text ${name} not found`);
    return customText.text.split(/ +/);
  } else {
    const customText = getLocalStorage()[name];
    if (customText === undefined)
      throw new Error(`Custom text ${name} not found`);
    return customText.split(/ +/);
  }
}

export function setCustomText(
  name: string,
  text: string | string[],
  long = false
): void {
  if (long) {
    const customText = getLocalStorageLong();

    customText[name] = {
      text: "",
      progress: 0,
    };

    const textByName = customText[name];
    if (textByName === undefined) {
      throw new Error("Custom text not found");
    }

    if (typeof text === "string") {
      textByName.text = text;
    } else {
      textByName.text = text.join(" ");
    }

    setLocalStorageLong(customText);
  } else {
    const customText = getLocalStorage();

    if (typeof text === "string") {
      customText[name] = text;
    } else {
      customText[name] = text.join(" ");
    }

    setLocalStorage(customText);
  }
}

export function deleteCustomText(name: string, long: boolean): void {
  const customText = long ? getLocalStorageLong() : getLocalStorage();

  delete customText[name];

  if (long) {
    setLocalStorageLong(customText as CustomTextLongObject);
  } else {
    setLocalStorage(customText as CustomTextObject);
  }
}

export function getCustomTextLongProgress(name: string): number {
  const customText = getLocalStorageLong()[name];
  if (customText === undefined) throw new Error("Custom text not found");

  return customText.progress ?? 0;
}

export function setCustomTextLongProgress(
  name: string,
  progress: number
): void {
  const customTexts = getLocalStorageLong();
  const customText = customTexts[name];
  if (customText === undefined) throw new Error("Custom text not found");

  customText.progress = progress;
  setLocalStorageLong(customTexts);
}

function getLocalStorage(): CustomTextObject {
  return JSON.parse(window.localStorage.getItem("customText") ?? "{}");
}

function getLocalStorageLong(): CustomTextLongObject {
  return JSON.parse(window.localStorage.getItem("customTextLong") ?? "{}");
}

function setLocalStorage(data: CustomTextObject): void {
  window.localStorage.setItem("customText", JSON.stringify(data));
}

function setLocalStorageLong(data: CustomTextLongObject): void {
  window.localStorage.setItem("customTextLong", JSON.stringify(data));
}

export function getCustomTextNames(long = false): string[] {
  if (long) {
    return Object.keys(getLocalStorageLong());
  } else {
    return Object.keys(getLocalStorage());
  }
}
