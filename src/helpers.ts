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
	try {
		return Boolean(new URL(inputurl));
	} catch (e) {
		return false;
	}
}
