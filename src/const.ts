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

type UsefulTabInfo = Pick<
	chrome.tabs.Tab,
	"id" | "url" | "title" | "favIconUrl" | "groupId"
>;

export type SavedGroup = {
	id: string; //unique id for storage
	chromeId: number; //from chrome when saving
	title?: string;
	color: chrome.tabGroups.ColorEnum;
	// count: number;
	// tabs: UsefulTabInfo[];
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
	try {
		return chrome.storage.sync.get(itemKey);
	} catch (error) {}
}
//TODO: make the return value typesafe

export async function setOneStorageObject(
	itemKey: StorageKey,
	value: boolean | number | string
) {
	try {
		chrome.storage.sync.set({ [itemKey]: value });
	} catch (error) {}
}

export async function getMultipleStorageItems(itemKeys: StorageKey[]) {
	return chrome.storage.sync.get([...itemKeys]);
}

type StorageObject = {
	itemKey: StorageKey;
	value: boolean | number | string;
};

export async function setMultipleStorageObjects(items: StorageObject[]) {
	try {
		chrome.storage.sync.set({ ...items });
	} catch (error) {}
}

export type GROUP_BY = "sot" | "sd";
export type GROUP_NAMING = "dom" | "subdom" | "subdomtld" | "nameless";

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
					original tab. The rules are also subdomain sensitive,
					meaning "https://en.wikipedia.com" is treated differenty than
					"https://wikipedia.com".`;

export const customHint = `Please put the website URL in this format: "https://somewebsite.com"
					or "http://sub.domain.com" without the quotes. Note: only the origin
					part of the URL (https://www.domain.com) is considered. The rules are
					applicable when you open new tabs from these websites - in other words
					- when they are the
					original tab. The rules are also
					subdomain sensitive, meaning "https://en.wikipedia.com" is
					treated differenty than "https://wikipedia.com". Duplicate entries
					will be ignored.`;

export const tabiusAscii = `
████████╗ █████╗ ██████╗ ██╗██╗   ██╗███████╗    ██████╗     ██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██║██║   ██║██╔════╝    ╚════██╗   ██╔═████╗
   ██║   ███████║██████╔╝██║██║   ██║███████╗     █████╔╝   ██║██╔██║
   ██║   ██╔══██║██╔══██╗██║██║   ██║╚════██║    ██╔═══╝    ████╔╝██║
   ██║   ██║  ██║██████╔╝██║╚██████╔╝███████║    ███████╗██╗╚██████╔╝
   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝╚═╝ ╚═════╝ 
                                                                     
`;
