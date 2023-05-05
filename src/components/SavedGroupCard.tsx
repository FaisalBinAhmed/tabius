import { useEffect, useState } from "preact/hooks";
import { Colors, SavedGroup } from "../const";
import { TrafficLightButton } from "./TrafficLightButton";
import { truncateText } from "./TabgroupCard";

type TabgroupCardProps = {
	group: SavedGroup;
	addToSavedGroupHandler: (id: string) => void;
	deleteSavedGroup: (id: string) => void;
};

export default function SavedGroupCard({
	group,
	addToSavedGroupHandler,
	deleteSavedGroup,
}: // count,
TabgroupCardProps) {
	// const [count, setCount] = useState(group.count);
	const [groupDetailIsOpen, setGroupDetailOpen] = useState(false);

	useEffect(() => {
		// fetchTabGroupCount();
	}, []);

	function toggleGroupDetails(e: MouseEvent) {
		setGroupDetailOpen((prev) => !prev);
	}

	async function deleteGroup(e?: MouseEvent) {
		e?.stopImmediatePropagation(); //prevents parent event getting triggered
		deleteSavedGroup(group.id);
	}
	async function restoreGroup(e?: MouseEvent) {
		e?.stopImmediatePropagation();
		// first we create the tabs

		const createdTabIds = await createTabs();

		// then we group the tabs together

		const options: chrome.tabs.GroupOptions = {
			tabIds: [...createdTabIds], //creates a new tab group with the new tab and the opener tab
		};

		console.log("creating group with", options);

		const groupdId = await chrome.tabs.group(options);

		console.log(groupdId);
	}

	async function createTabs() {
		const createdTabIds: number[] = await Promise.all(
			group.tabs.map(async (tab) => {
				const createProperties: chrome.tabs.CreateProperties = {
					url: tab.url,
					active: false, //don't move the focus
				};
				const newTab = await chrome.tabs.create(createProperties);
				return newTab.id;
			})
		);
		return createdTabIds;
	}

	return (
		<div
			className="tabgroupContainer"
			style={{
				backgroundColor: Colors[group.color],
				marginBottom: groupDetailIsOpen ? 0 : -13,
			}}>
			<div
				className="tabgroupCard"
				title="Click to open"
				onClick={toggleGroupDetails}>
				<div className="tabgroupData">
					<span className="tabgroupName">{truncateText(group.title)}</span>
					<span
						// style={{ color: Colors[group.color] }}
						className="tabgroupCount">
						{group.tabs.length}
					</span>
				</div>
				<div className="trafficLights">
					<TrafficLightButton
						onClick={restoreGroup}
						icon="/icons/open-in-browser.svg"
						color="#a8f57d"
						tooltip="Restore this tab group"
					/>
					<TrafficLightButton
						onClick={deleteGroup}
						icon="/icons/trash.svg"
						color="#fe5f58"
						tooltip="Delete this saved group"
					/>
				</div>
			</div>

			{groupDetailIsOpen && (
				<div
					className="addButton"
					onClick={() => addToSavedGroupHandler(group.id)}>
					{" "}
					+ Add current tab to this group
				</div>
			)}

			{groupDetailIsOpen && group.tabs?.length && (
				<div className="tabscontainer">
					{group.tabs.map((tab) => (
						<div key={tab.id} className="tabcard">
							<div className="tabdetails">
								{tab.favIconUrl ? (
									<img
										width="18px"
										height="18px"
										style={{ marginRight: "5px" }}
										src={tab.favIconUrl}
									/>
								) : (
									<img
										width="18px"
										height="18px"
										style={{ marginRight: "5px" }}
										src="/icons/media-image.svg"
									/>
								)}
								{truncateText(tab.title, 30)}
							</div>
							<div className="trafficLights">
								{/* <TrafficLightButton
									onClick={() => {}}
									icon="/icons/transition-up.svg"
									color="#29aeff"
								/> */}
								<TrafficLightButton
									onClick={() => {}}
									icon="/icons/trash.svg"
									color="#fe5f58"
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
