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

export const K_LONELY = "lonely";
export const K_AUTO_COLLAPSE = "autocollapse";
export const K_BLOCK_LIST = "blocklist";
export const K_CUSTOM_RULES = "customrules";
export const K_MAXIMUM_TABS_PER_GROUP = "maximum";
export const K_GROUP_BY_RULE = "groupby";
