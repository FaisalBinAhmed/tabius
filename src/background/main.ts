// Background Script Code

chrome.tabs.onUpdated.addListener(handleTabUpdate);

chrome.tabs.onActivated.addListener(handleActiveTab);

function handleActiveTab(activeInfo: chrome.tabs.TabActiveInfo) {
	chrome.tabs.get(activeInfo.tabId, (tab: chrome.tabs.Tab) => {
		tab.url && console.log(tab.url); //sometimes the url is undefined
	});
}

function handleTabUpdate(
	tabId: number,
	changeInfo: chrome.tabs.TabChangeInfo,
	tab: chrome.tabs.Tab
) {
	changeInfo.url && console.log(changeInfo.url); //sometimes the url is undefined
}
