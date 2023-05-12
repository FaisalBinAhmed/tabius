import { render } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import TabgroupCard from "./components/TabgroupCard";
import { withBlock } from "./background/background";
import {
	addUrlToBlocklist,
	deleteUrlFromBlocklist,
	generateId,
	isTheURLNative,
} from "./helpers";
import {
	// IconButton,
	TrafficLightButton,
} from "./components/TrafficLightButton";
import { SavedGroup, getOneStorageItem } from "./const";
import SavedGroupCard from "./components/SavedGroupCard";
import ToastContextProvider, { ToastContext } from "./context/ToastContext";

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

	const [savedGroupIds, setSavedGroupIds] = useState<string[]>([]);
	const [savedGroups, setSavedGroups] = useState<SavedGroup[]>([]);

	const { showToastNotification } = useContext(ToastContext);

	// const [inATabGroup, setInATabGroup] = useState(false)

	useEffect(() => {
		fetchTabGroups();
		fetchSavedTabGroups();
		fetchBlockInfo();
		// isItAtabGroup();
	}, []);

	// async function isItAtabGroup() {
	//this should check whether the current tab is in a tab group
	//so we cn save this when user clicks on the add button

	// }

	async function fetchTabGroups() {
		let tg = await getAllTabGroups();
		setTabGroups(tg);
	}

	async function fetchSavedTabGroups() {
		//first I fetch the uuids of the saved groups
		const sgids = (await getOneStorageItem("savedgroupids")) as {
			savedgroupids: string[];
		};

		if (Array.isArray(sgids.savedgroupids) && sgids.savedgroupids.length) {
			setSavedGroupIds(sgids.savedgroupids);

			//now we fetch the actual saved groups

			sgids.savedgroupids.forEach(async (id) => {
				const savedGroup = await chrome.storage.sync.get(id);
				console.log(savedGroup);

				if (savedGroup[id]) {
					setSavedGroups((prev) => prev.concat(savedGroup[id]));
				}
			});
		}

		// if (sg?.savedgroups?.length) {
		// 	setSavedGroups(sg.savedgroups); //TODO type safe this
		// }
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
		const currentTab = await chrome.tabs.query({
			active: true,
		});

		if (siteIsBlocked) {
			//have to unblock the site

			(await deleteUrlFromBlocklist(currentTab[0].url)) &&
				setSiteBlocked(false);
		} else {
			//site is not blockedS
			//should be added to blocklist

			(await addUrlToBlocklist(currentTab[0].url)) && setSiteBlocked(true); //short circuit to only trigger when the saving is a success
		}
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
		id: number, //this is the same id from chrome, should be number
		color: chrome.tabGroups.ColorEnum,
		name?: string
	) {
		const queryInfo = {
			groupId: id,
		};

		try {
			const tabsInTheGroup = await chrome.tabs.query(queryInfo);

			const uuid = generateId();

			const newGroupToSave: SavedGroup = {
				id: uuid, //uuid for storage. DO I NEED THIS? the key is already this value
				chromeId: id, //saving the original groupId (number) for future reference
				title: name,
				color: color,
				tabs: tabsInTheGroup,
			};

			// let newSavedGroups = [...savedGroups, newGroupToSave];

			chrome.storage.sync.set(
				{
					[uuid]: newGroupToSave,
				},
				function () {
					setSavedGroups((prev) => prev.concat(newGroupToSave)); //updating the state with new group
					saveAndUpdateUUID(uuid);
					showToastNotification("Tab group saved", "green");
				}
			);
		} catch (error) {
			showToastNotification("Error saving item", "red");
			console.log(error);
		}
	}

	async function saveAndUpdateUUID(uuid: string) {
		let newSavedGroupIds: string[] = [...savedGroupIds, uuid];

		//saving the ids first
		//8KB limit / 36 bytes uuid = 227 entries, should be enough
		try {
			chrome.storage.sync.set({
				savedgroupids: newSavedGroupIds,
			});

			setSavedGroupIds(newSavedGroupIds);
		} catch (error) {
			console.log(error);
		}
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

	async function addCurrentTabToSavedGroup(id: string) {
		//the id is the groupId saved in storage

		let sg = [...savedGroups];

		let gIndex = sg.findIndex((item) => item.id === id);

		const currentTab = await chrome.tabs.query({
			active: true,
		});

		sg[gIndex].tabs.push(currentTab[0]); //the first one is the currentTab

		try {
			chrome.storage.sync.set(
				{
					savedgroups: sg,
				},
				function () {
					setSavedGroups(sg);
					showToastNotification("Saved tab to group", "green");
				}
			);
		} catch (error) {
			showToastNotification("Error saving item", "red");
		}
	}

	function deleteSavedGroup(id: string) {
		let sg = savedGroups.filter((item) => item.id !== id);

		try {
			chrome.storage.sync.set(
				{
					savedgroups: sg,
				},
				function () {
					setSavedGroups(sg);
					// set_status(" deleted.");
				}
			);
		} catch (error) {
			showToastNotification("Storage error", "red");
		}
	}

	async function closeTabGroup(id: number) {
		const queryInfo = {
			groupId: id,
		};
		try {
			const tabsToClose = await chrome.tabs.query(queryInfo);
			tabsToClose.forEach((item) => chrome.tabs.remove(item?.id));
			// should remove the entry from the popup here
			// const a = document.getElementById(`tabcard${groupId}`); // ID can't be numbers :/
			// a.remove();

			const newTG = tabGroups.filter((item) => item.id !== id);

			setTabGroups(newTG);
		} catch (error) {}
	}

	function addToOpenTabGroups(tg: chrome.tabGroups.TabGroup) {
		setTabGroups((prev) => prev.concat(tg));
	}

	return (
		<div className="popuproot">
			<div className="headercontainer">
				<div className="pophead">
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
						{/* <IconButton
							onClick={saveCurrentOpenTabGroup}
							icon="/icons/plus.svg"
							color="#bbc9d2"
							tooltip="Save current tab group"
							title="Add"
						/> */}
						{/* <TrafficLightButton
							onClick={maximizeAllGroups}
							icon="/icons/open-in-browser.svg"
							color="#a8f57d"
							tooltip="Open all saved groups"
						/> */}
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
								<SavedGroupCard
									key={group.id}
									group={group}
									addToSavedGroupHandler={addCurrentTabToSavedGroup}
									deleteSavedGroup={deleteSavedGroup}
									addToOpenTabGroups={addToOpenTabGroups}
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
			) : tabGroups.length ? (
				<div>
					{tabGroups.map((tg) => (
						<TabgroupCard
							key={tg.id}
							name={tg.title}
							color={tg.color}
							id={tg.id}
							collapsed={tg.collapsed}
							saveHandler={saveTabGroup}
							closeHandler={closeTabGroup}
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

render(
	<ToastContextProvider>
		<ActionPage />
	</ToastContextProvider>,
	document.getElementById("action")!
);
