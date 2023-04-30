import { EXCLUDED_URL } from "./const";

export function isTheURLNative(url?: string) {
	if (!url) {
		return false;
	}
	return EXCLUDED_URL.some((item) => url.includes(item));
}

export function generateId() {
	let size = 12;
	let charset = "abcdefghijklmnopqrstuvwxyz";
	let result = "";
	for (let i = 0; i < size; i++) {
		result += charset[Math.floor(Math.random() * charset.length)];
	}
	return result;
}

export function isValidUrl(inputurl: string) {
	let regex =
		/(http|https):\/\/[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~]*)*(#[\w\-]*)?(\?.*)?/;
	if (!regex.test(inputurl)) {
		return false;
	} else {
		return true;
	}
}
