import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import TabgroupCard from "./components/TabgroupCard";
import { withBlock } from "./background/background";
import { isTheURLNative } from "./helpers";
import {
	IconButton,
	TrafficLightButton,
} from "./components/TrafficLightButton";
import { SavedGroup, getOneStorageItem } from "./const";
import SavedGroupCard from "./components/SavedGroupCard";

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

function handleRatingButton() {
	// check if it"s chrome or edge
	window.open(
		"https://chrome.google.com/webstore/detail/tabius-tab-grouping-assis/enceimdjnaccoeikjobaeicfodlfnijp"
	);
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

	const [showSavedGroups, setShowSavedGroups] = useState(false);

	const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);

	useEffect(() => {
		fetchTabGroups();
		fetchSavedTabGroups();
		fetchBlockInfo();
	}, []);

	async function fetchTabGroups() {
		let tg = await getAllTabGroups();
		setTabGroups(tg);
	}

	async function fetchSavedTabGroups() {
		const sg = await getOneStorageItem("savedgroups");
		if (sg?.savedgroups?.length) {
			setSavedGroups(sg.savedgroups); //TODO type safe this
		}
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

	function minimizeAllGroups() {
		toggleAllGroups(true);
	}
	function maximizeAllGroups() {
		toggleAllGroups(false);
	}

	function toggleSavedGroups() {
		setShowSavedGroups((prev) => !prev);
	}

	async function saveTabGroup(
		id: number,
		color: chrome.tabGroups.ColorEnum,
		count: number,
		name?: string
	) {
		const queryInfo = {
			groupId: id,
		};

		try {
			const tabsInTheGroup = await chrome.tabs.query(queryInfo);

			let newGroupToSave: SavedGroup = {
				id: id,
				title: name,
				color: color,
				count: count,
				tabs: tabsInTheGroup,
			};

			let newSavedGroups = [...savedGroups, newGroupToSave];

			chrome.storage.sync.set(
				{
					savedgroups: newSavedGroups,
				},
				function () {
					setSavedGroups(newSavedGroups);
				}
			);
		} catch (error) {}
	}

	async function toggleAllGroups(shouldCollapse: boolean) {
		const queryInfo = {
			windowId: -2,
		};

		try {
			const tabGroups = await chrome.tabGroups.query(queryInfo);

			tabGroups.forEach(async (item) => {
				const groupId = item.id;
				const updateProperties = {
					collapsed: shouldCollapse,
				};

				await chrome.tabGroups.update(groupId, updateProperties);
			});
		} catch (error) {}
	}

	return (
		<div className="popuproot">
			<div className="headercontainer">
				<div className="pophead">
					{/* <div style="display: flex; flex-direction: column; margin-right: 10px">
						<span style="flex: 1"></span>
						<img src="/icon.png" width="32px" height="32px" />
						<span style="flex: 1"></span>
					</div> */}
					<div class="title">Tabius</div>

					<img
						title="Rate it"
						class="settingsbutton"
						src="/icons/heart.svg"
						onClick={handleRatingButton}
					/>

					<img
						title="Tabius settings"
						class="settingsbutton"
						src="/icons/settings.svg"
						onClick={handleOptionButton}
					/>
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
			<div className="bigcard">
				<span onClick={toggleSavedGroups} className="togglecontainer">
					<span
						style={{ opacity: showSavedGroups ? "25%" : "100%" }}
						className="toggle">
						Current
					</span>
					<span
						style={{ opacity: showSavedGroups ? "100%" : "25%" }}
						className="toggle">
						Saved
					</span>
				</span>

				{showSavedGroups ? (
					<div className="trafficLights">
						<IconButton
							onClick={minimizeAllGroups}
							icon="/icons/plus.svg"
							color="#bbc9d2"
							tooltip="Save current tab group"
							title="Add"
						/>
						<TrafficLightButton
							onClick={maximizeAllGroups}
							icon="/icons/open-in-browser.svg"
							color="#a8f57d"
							tooltip="Open all saved groups"
						/>
					</div>
				) : (
					<div className="trafficLights">
						<TrafficLightButton
							onClick={minimizeAllGroups}
							icon="/icons/minus.svg"
							color="#febc30"
							tooltip="Minimize all tab groups"
						/>
						<TrafficLightButton
							onClick={maximizeAllGroups}
							icon="/icons/enlarge.svg"
							color="#28c840"
							tooltip="Maximize all tab groups"
						/>
					</div>
				)}
			</div>

			{showSavedGroups ? (
				<div>
					{savedGroups.length ? (
						<div>
							{savedGroups.map((group) => (
								<SavedGroupCard group={group} />
							))}
						</div>
					) : (
						<div className="nothing">
							<img src="/icons/emoji-puzzled.svg" />
							<p>Nothing to see here</p>
						</div>
					)}
				</div>
			) : tabGroups.length ? (
				<div>
					{tabGroups.map((tg) => (
						<TabgroupCard
							name={tg.title}
							color={tg.color}
							id={tg.id}
							collapsed={tg.collapsed}
							saveHandler={saveTabGroup}
						/>
					))}
				</div>
			) : (
				<div className="nothing">
					<img src="/icons/emoji-puzzled.svg" />
					<p>Nothing to see here</p>
				</div>
			)}
		</div>
	);
};

render(<ActionPage />, document.getElementById("action")!);
