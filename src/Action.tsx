import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import TabgroupCard, { TrafficLightButton } from "./components/TabgroupCard";
import { isTheURLNative, withBlock } from "./background/background";

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

function handleOptionButton() {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL("options.html"));
	}
}

async function getAllTabGroups() {
	const queryInfo = {
		windowId: -2,
	};
	// who knew -2 always refers to the current window. So much stuff for this.
	const tabGroups = await chrome.tabGroups.query(queryInfo);
	return tabGroups;
}

const ActionPage = () => {
	const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);

	const [siteIsBlocked, setSiteBlocked] = useState(false);

	useEffect(() => {
		fetchTabGroups();
		fetchBlockInfo();
	}, []);

	async function fetchTabGroups() {
		let tg = await getAllTabGroups();
		setTabGroups(tg);
	}

	async function fetchBlockInfo() {
		const currentTab = await chrome.tabs.query({
			active: true,
		});

		if (isTheURLNative(currentTab[0].url)) {
			return;
		}
		let a = await withBlock(currentTab[0].url);
		setSiteBlocked(a);
	}

	async function handleBlockButton() {
		setSiteBlocked((prev) => !prev);
		//TODO save to storage
	}

	function minimizeAllGroups() {}
	function maximizeAllGroups() {}

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
					src="/settings.svg"
					onClick={handleOptionButton}
				/>
			</div>
			<div className="bigcard">
				<div class="bigcardhead">
					<div className="totaltgcount">
						<b>{tabGroups.length}</b> tab Groups
					</div>
					<div className="trafficLights">
						<TrafficLightButton
							onClick={minimizeAllGroups}
							icon="-"
							color="#febc30"
						/>
						<TrafficLightButton
							onClick={maximizeAllGroups}
							icon="⤢"
							color="#28c840"
						/>
					</div>
				</div>
				<div
					style={{ color: siteIsBlocked ? "#008751" : "#ff004d" }}
					className="blockbutton"
					onClick={handleBlockButton}
					title="Quickly blacklist or unblacklist this site from creating new tab groups">
					{/* <p> */}
					{siteIsBlocked ? "Enable for this domain" : "Disable for this domain"}
					{/* </p> */}
				</div>
			</div>
			<div>
				{tabGroups.map((tg) => (
					<TabgroupCard
						name={tg.title}
						color={tg.color}
						id={tg.id}
						collapsed={tg.collapsed}
					/>
				))}
			</div>
		</div>
	);
};

render(<ActionPage />, document.getElementById("action")!);
