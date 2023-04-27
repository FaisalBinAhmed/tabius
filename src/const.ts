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

// export const K_LONELY = "lonely";
// export const K_AUTO_COLLAPSE = "autocollapse";
// export const K_BLOCK_LIST = "blocklist";
// export const K_CUSTOM_RULES = "customrules";
// export const K_MAXIMUM_TABS_PER_GROUP = "maximum";
// export const K_GROUP_BY_RULE = "groupby";
// export const K_NAMING_RULE = "naming";
// export const K_REGARDLESS_DOMAIN = "regardless";

// export const SettingsObject: SettingsMap = {
// 	K_LONELY: "lonely",
// };

export type StorageKey =
	| "lonely"
	| "autocollapse"
	| "blocklist"
	| "customrules"
	| "maximum"
	| "groupby"
	| "naming"
	| "regardless";

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
