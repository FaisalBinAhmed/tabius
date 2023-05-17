// Background Script Code

import { GROUP_NAMING, getOneStorageItem } from "../const";
import { isTheURLNative } from "../helpers";

chrome.tabs.onCreated.addListener(async (tab) => await createTab(tab));

//UnGroup an existing tab from its group
function ungroupOneTab(tabId: chrome.tabs.Tab["id"]) {
	// const tabIds = parseInt(tab);
	if (!tabId) {
		return;
	}

	chrome.tabs.ungroup(tabId, () => {
		// console.log("tab was ungrouped")
	});
}

async function createTab(newtab: chrome.tabs.Tab) {
	// console.log("new tab created");

	if (!newtab.id) {
		return;
	}

	//fetching the new tab info again
	// workaround for tab sometimes not having pending or url for some some seconds.
	const tab = await chrome.tabs.get(newtab.id);

	//TODO: handle no openertab

	let getout = false;
	let newGroup = true;
	let maximumAchieved = false;
	// to stop propagating the function

	//this options is used to create a new tab group down the road

	const options: chrome.tabs.GroupOptions = {
		tabIds: [tab.id, tab.openerTabId], //creates a new tab group with the new tab and the opener tab
	};

	// if(tab.id){options.tabIds}

	//getting the original tab to see if it's a member of a group already, for some reason the groupId in tab was always set to -1
	let openerTabInfo;
	if (tab.openerTabId) {
		openerTabInfo = await chrome.tabs.get(tab?.openerTabId);
		// console.log("opener tab info", getTabPromise);
		if (openerTabInfo.pinned) return; //if the opener tab is pinned, we don't put the tabs in a group
	} else {
		// console.log(error);
	}

	// checking if a blocking rule exists if yes stop running the function
	const blockFound = await withBlock(openerTabInfo?.url);
	if (blockFound) {
		// it is possible that a blocksite can be opened from an already existing group, in that case it will be
		// part of a group already, so this function will exit, and wont let maximum calculation to happen
		// console.log("block found");
		try {
			ungroupOneTab(tab.id);
		} catch (error) {}
		return;
	}

	//checking if it is not included in a group, else creates a new group
	if (openerTabInfo?.groupId !== -1) {
		options.groupId = openerTabInfo?.groupId;
		newGroup = false;
	}
	// console.log(newGroup, "new group");
	// console.log(options);

	// checking maximum limitation

	const maximumPropmise = await getOneStorageItem("maximum");

	if (maximumPropmise?.maximum && parseInt(maximumPropmise.maximum) > 1) {
		if (!newGroup) {
			//checking if its a new group
			const tabsNumber = await getSingleGroupNumberOfTab(
				openerTabInfo?.groupId
			);
			// console.log("number of tabs", tabsNumber, maximumPropmise.maximum);

			if (tabsNumber > parseInt(maximumPropmise.maximum)) {
				// console.log("no group should be created");
				maximumAchieved = true;

				// chrome will include the tab in the existing group anyway, so we have to ungroup it manually
				ungroupOneTab(tab.id);
			}
		}
	}

	try {
		// checking if any of the url exists at all first, sometimes the urls are empty but it still gets a name :S
		// console.log("I was run", tab, maximumAchieved);
		// const newnewtab = await chrome.tabs.get(tab.id);
		// console.log("new  new tab after", tab);
		// ?? should also check origin url

		if (
			(tab.url || tab.pendingUrl) &&
			!isTheURLNative(tab.pendingUrl ?? tab.url) &&
			!isTheURLNative(openerTabInfo?.url) &&
			!maximumAchieved
		) {
			// console.log("max ach", maximumAchieved);
			// excluding all native chrome protocol pages
			// has side effects. looks like some time tabs are opened without having a pendingURL property
			// results in error when pendingUrl is not found while opening the tab directly.
			// this can however be used to control whether tab group should be created by right clicking or just by target _blank

			const groupByPropmise = await getOneStorageItem("groupby"); //chrome.storage.sync.get([K_GROUP_BY_RULE]);
			const originalURL = openerTabInfo?.url;
			const newUrl = tab.pendingUrl ?? tab.url;
			if (
				groupByPropmise?.groupby === "sd" &&
				getHostname(originalURL) !== getHostname(newUrl)
			) {
				// console.log("true, domain didnt match");
				getout = true;
				// this will be uncommented, it will prevent tab from being group together if they are not from the same domain when sd is on
				// question is where to put this check??
			}
			if (getout) {
				// let tabIds = tab.id;

				const regardlessPropmise = await getOneStorageItem("regardless");

				// console.log("regardless", regardlessPropmise);
				if (regardlessPropmise?.regardless !== true) {
					ungroupOneTab(tab.id);
				}
				// now I have option to combine new tab from a group to always be in the group regardless of domain
				// to be implemented. IMPLEMENTED!
				return;
				// by default chrome will group the tab anyway if it was opened from a group, NOT ANYMORE
			}
			//creating the group
			const groupId = await chrome.tabs.group(options); //returns group id
			// console.log(groupId);

			// this should be executed if there is no group name already. DONE!!

			//checking if a title exists already
			const existingTabGroup = await chrome.tabGroups.get(groupId);

			if (!existingTabGroup.title) {
				// custom rule checking
				// this should be based on original tab or new tab??
				const crule = await withCustomRule(openerTabInfo?.url);

				// console.log(crule, "custom rule clog");

				let tabgroupName: string | undefined;
				let color: chrome.tabGroups.ColorEnum | undefined;
				let updateProperties: chrome.tabGroups.UpdateProperties;

				//if custom tab rule exists for this domain, we asign the custom rule
				if (crule) {
					tabgroupName = crule.alias;
					color = crule.color;
				} else {
					//we choose something dependingn on the domain rule
					tabgroupName = await getDomain(
						openerTabInfo?.pendingUrl ?? openerTabInfo?.url
					); //getting original tab's url and checking if it's pending
				}

				// console.log(tabgroupName);

				if (color) {
					updateProperties = {
						title: tabgroupName,
						color: color,
					};
				} else {
					updateProperties = {
						title: tabgroupName,
					};
				}
				// updating the group after creation
				try {
					const groupUpdated = await chrome.tabGroups.update(
						groupId,
						updateProperties
					);
					// console.log(groupUpdated);
				} catch (error) {
					// console.log(error, groupId, tabgroupName);
				}
			}
		}
	} catch (error) {
		// console.log("55", error);

		if (
			error ==
			"Error: Tabs cannot be edited right now (user may be dragging a tab)."
		) {
			setTimeout(() => createTab(tab), 50);
		}
	}
}

async function getDomain(url?: string) {
	if (!url) {
		return;
	}

	const domain = new URL(url).hostname;
	const fragments = domain.split(".");
	// console.log("url pieces", fragments);
	// let groupname = justDomain();
	const groupnamePropmise = (await getOneStorageItem("naming")) as {
		naming: GROUP_NAMING;
	}; //chrome.storage.sync.get<StorageKey>([K_NAMING_RULE]);
	// console.log(groupnamePropmise);

	switch (groupnamePropmise?.naming) {
		case "dom":
			return justDomain();

		case "subdom":
			return fragments.length > 2
				? fragments[0] + "." + fragments[1]
				: fragments[0];

		case "subdomtld":
			return domain;

		case "nameless":
			return "";

		default:
			return justDomain();
	}

	function justDomain() {
		if (fragments.length > 2) {
			return fragments[1];
		}
		return fragments[0];
	}
}

export function getHostname(url?: string) {
	if (!url) return;
	return new URL(url).hostname;
}

export type CustomRule = {
	id: string;
	url: string;
	alias: string;
	color: chrome.tabGroups.ColorEnum;
};

//return the rule if it exists for the said url
async function withCustomRule(url?: string): Promise<CustomRule | false> {
	if (!url) {
		return false;
	}

	try {
		const rules = await getOneStorageItem("customrules"); //chrome.storage.sync.get([K_CUSTOM_RULES]);
		// console.log(rules?.customrules);
		const rule = rules?.customrules?.find(
			(item: CustomRule) => getHostname(item.url) === getHostname(url)
		);

		return rule;
	} catch (error) {
		// console.log(error);
		return false;
	}
}

export type BlockRule = {
	id: string;
	blockedUrl: string;
};

export async function withBlock(url?: string): Promise<boolean> {
	if (!url) {
		return false;
	}
	try {
		const rules = await getOneStorageItem("blocklist"); //chrome.storage.sync.get([K_BLOCK_LIST]);
		// console.log(rules?.blocklist);
		const rule: boolean = rules?.blocklist?.find(
			(item: BlockRule) => getHostname(item.blockedUrl) === getHostname(url)
		);

		return rule;
	} catch (error) {
		// console.log(error);
		return false;
	}
}

async function getSingleGroupNumberOfTab(tabGroupId?: number) {
	if (!tabGroupId) return 0; //with no groupId, chrome will return the number of all tabs that are open

	const queryInfo = {
		groupId: tabGroupId,
	};
	const tabNumbers = await chrome.tabs.query(queryInfo);
	//Gets all tabs that have the specified properties, or all tabs if no properties are specified.
	return tabNumbers.length;
}

// group event related

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
	// console.log("220", removeInfo);

	const lonely = await getOneStorageItem("lonely"); //chrome.storage.sync.get([K_LONELY]);
	if (!lonely?.lonely) return;

	const queryInfo = {
		windowId: -2,
	};

	const tabGroups = await chrome.tabGroups.query(queryInfo);
	// console.log(tabGroups);

	let isLonely = false;
	// tabGroups.some(async (item) => await isGroupNotLonely(item.id));
	// while (!isLonely) {
	tabGroups.forEach(async (item) => {
		isLonely = await isGroupNotLonely(item.id);
	});
	// }
});

async function isGroupNotLonely(tabGroupId: number) {
	const queryInfo = {
		groupId: tabGroupId,
	};
	const tabNumbers = await chrome.tabs.query(queryInfo);
	// console.log("223", tabNumbers);
	if (tabNumbers.length === 1) {
		//ungrouping the tab:
		const tabId = tabNumbers[0].id;
		// const a =
		if (tabId) {
			await chrome.tabs.ungroup(tabId);
		}
		// console.log("lonely group unlonlied", a);

		return true;
	}
	// console.log("this group is not lonely", tabGroupId);
	return false;
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	//check if I should autocollapse tabs in the groups

	const autocollapse = await getOneStorageItem("autocollapse"); //chrome.storage.sync.get([K_AUTO_COLLAPSE]);

	if (!autocollapse?.autocollapse) return; //we don't have to do anything

	//handle if current tab is already inside a tabgroup

	const currentTab = await getCurrentTab();

	const currentTabGroup = currentTab.groupId;
	//if currentTab.groupInfo === -1, the tab is not part of any tab groups

	// console.log(activeInfo, currentTab);

	//find tabs in tabGroups
	const queryInfo = {
		windowId: -2,
	};
	const tabGroups = await chrome.tabGroups.query(queryInfo);

	// console.log("tabgroups", tabGroups);

	for (const group of tabGroups) {
		if (group.id === currentTabGroup || group.collapsed) {
			continue;
		}
		const groupId = group.id;
		const updateProperties = {
			collapsed: true,
		};

		try {
			// console.log("collapsing group", groupId, group.title);
			await chrome.tabGroups.update(groupId, updateProperties);
		} catch (error) {
			if (
				error ==
				"Error: Tabs cannot be edited right now (user may be dragging a tab)."
			) {
				setTimeout(() => collapseTabGroup(groupId), 200); //closing this after 0.2 seconds
			}
		}
	} //for of
	// in that case, don't close that
});

async function collapseTabGroup(groupId: number) {
	// console.log("fallback close group", groupId);
	const updateProperties = {
		collapsed: true,
	};
	await chrome.tabGroups.update(groupId, updateProperties);
}

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}
