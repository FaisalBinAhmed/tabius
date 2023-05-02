type ColorMap = {
	[key in chrome.tabGroups.ColorEnum]: string;
};

export const Colors: ColorMap = {
	grey: "#E0E0E0",
	blue: "#82B1FF",
	red: "#E57373",
	yellow: "#FFF176",
	green: "#81C784",
	pink: "#FF80AB",
	purple: "#EA80FC",
	cyan: "#84FFFF",
	orange: "#FC9B51",
};

export const EXCLUDED_URL = [
	"chrome://",
	"chrome-extension://",
	"edge://",
	"extensions://",
];

// storage keys

export type SavedGroup = {
	id: number; //same as the original group. SHOULD CHECK FOR CLASH WHEN STORING
	title?: string;
	color: chrome.tabGroups.ColorEnum;
	count: number;
	tabs: chrome.tabs.Tab[];
};

export type StorageKey =
	| "lonely"
	| "autocollapse"
	| "blocklist"
	| "customrules"
	| "maximum"
	| "groupby"
	| "naming"
	| "regardless"
	| "savedgroups";

export async function getOneStorageItem(itemKey: StorageKey) {
	return chrome.storage.sync.get(itemKey);
}

export async function setOneStorageObject(
	itemKey: StorageKey,
	value: boolean | number | string
) {
	chrome.storage.sync.set({ [itemKey]: value });
}

export async function getMultipleStorageItems(itemKeys: StorageKey[]) {
	return chrome.storage.sync.get([...itemKeys]);
}

type StorageObject = {
	itemKey: StorageKey;
	value: boolean | number | string;
};

export async function setMultipleStorageObjects(items: StorageObject[]) {
	chrome.storage.sync.set({ ...items });
}

export type GROUP_BY = "sot" | "sd";
export type GROUP_NAMING = "dom" | "subdom" | "subdomtld";

export type BlockList = {
	id: string;
	blockedUrl: string;
};

export type CustomRule = {
	id: string;
	url: string;
	alias: string;
	color?: chrome.tabGroups.ColorEnum;
};

export const blockHint = `Please put the website URL in this format: "https://somewebsite.com"
					or "http://sub.domain.com" without the quotes. Note: only the origin
					part of the URL (https://www.domain.com) is considered when
					blacklisting. The rules are applicable when you open new tabs from
					these websites - in other words - when they are the{" "}
					<b>original tab</b>. The rules are also <b>subdomain sensitive</b>,
					meaning "https://en.wikipedia.com" is treated differenty than
					"https://wikipedia.com".`;

export const customHint = `Please put the website URL in this format: "https://somewebsite.com"
					or "http://sub.domain.com" without the quotes. Note: only the origin
					part of the URL (https://www.domain.com) is considered. The rules are
					applicable when you open new tabs from these websites - in other words
					- when they are the
					<b>original tab</b>. The rules are also
					<b>subdomain sensitive</b>, meaning "https://en.wikipedia.com" is
					treated differenty than "https://wikipedia.com". Duplicate entries
					will be ignored.`;
