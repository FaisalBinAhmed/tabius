import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import TabgroupCard from "./components/TabgroupCard";

async function handleCurrentTabBlock() {
	// get current tab
	try {
		// const currentTab = await chrome.tabs.query({
		// 	active: true,
		// });
		// if (checkNativeUrl(currentTab[0].url)) {
		// 	blockbutton.remove();
		// } else {
		// 	blockbutton.innerHTML = disableHtml;
		// 	// console.log(currentTab);
		// 	blockbutton.addEventListener(
		// 		"click",
		// 		async () => await addBlock(currentTab[0].url)
		// 	);
		// 	if (await withBlock(currentTab[0].url)) {
		// 		blockbutton.innerHTML = enableHtml;
		// 		blockbutton.addEventListener(
		// 			"click",
		// 			async () => await removeBlock(currentTab[0].url)
		// 		);
		// 	}
		// }
	} catch (error) {
		// console.log(error);
	}
}

async function getAllTabGroups() {
	// const currentWindowId = await getCurrentWindow();

	const queryInfo = {
		windowId: -2,
	};
	// who knew -2 always refers to the current window. So much stuff for this.

	const tabGroups = await chrome.tabGroups.query(queryInfo);
	// console.log(tabGroups);

	return tabGroups;
}

const ActionPage = () => {
	const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);

	useEffect(() => {
		fetchTabGroups();
	}, []);

	async function fetchTabGroups() {
		let tg = await getAllTabGroups();
		setTabGroups(tg);
	}

	return (
		<div className="popuproot">
			<div className="pophead">
				<div style="display: flex; flex-direction: column; margin-right: 10px">
					<span style="flex: 1"></span>
					<img src="/icon.png" width="32px" height="32px" />
					<span style="flex: 1"></span>
				</div>
				<div class="title">
					<p>Tabius</p>
				</div>

				<img
					title="Tabius settings"
					class="settingsbutton"
					src="icons/settings.svg"
				/>
				<div
					id="hey"
					title="Blacklist or unblacklist this site from creating new tab groups">
					<p>Blacklist</p>
				</div>
			</div>
			<div>
				{tabGroups.map((tg) => (
					<TabgroupCard name={tg.title} color={tg.color} id={tg.id} />
				))}
			</div>
		</div>
	);
};

render(<ActionPage />, document.getElementById("action")!);
