import { BlockRule, getHostname } from "./background/background";
import { BlockList, EXCLUDED_URL, getOneStorageItem } from "./const";

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
	let u;
	try {
		u = new URL(inputurl);
	} catch (e) {
		return false;
	}
	return u.protocol === "https:" || u.protocol === "http:";
}

//returns true if blocklist has been added successfully
export async function addUrlToBlocklist(url?: string) {
	if (!url) return false;

	const id = generateId();

	if (!isValidUrl(url)) {
		// set_status("Please enter a valid url.", "red");
		return false;
	} else {
		const { blocklist } = await getOneStorageItem("blocklist");
		const newSite: BlockList = {
			id: id,
			blockedUrl: url,
		};

		let newBlockList = [...blocklist, newSite];

		chrome.storage.sync.set({
			blocklist: newBlockList,
		});

		return true;
	}
}

export async function deleteUrlFromBlocklist(url?: string) {
	if (!url) return false;

	try {
		const { blocklist } = await getOneStorageItem("blocklist"); //chrome.storage.sync.get([K_BLOCK_LIST]);
		const rules: BlockList[] = blocklist?.filter(
			(item: BlockRule) => getHostname(item.blockedUrl) !== getHostname(url)
		);

		chrome.storage.sync.set({
			blocklist: rules,
		});

		return true;
	} catch (error) {
		// console.log(error);
		return false;
	}
}
