import { EXCLUDED_URL } from "./const";

export function isTheURLNative(url?: string) {
	if (!url) {
		return false;
	}
	return EXCLUDED_URL.some((item) => url.includes(item));
}

export function generateId() {
	return crypto.randomUUID();
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
