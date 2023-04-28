import { useEffect, useState } from "preact/hooks";
import { Colors } from "../const";
import GroupDetails from "./GroupDetails";

export function truncateText(text?: string, length = 18) {
	if (!text) return;

	if (text.length > length) {
		return text.slice(0, length) + " ...";
	} else {
		return text;
	}
}

type TabgroupCardProps = {
	id: number;
	name?: string;
	color: chrome.tabGroups.ColorEnum;
	collapsed: boolean;
};

export default function TabgroupCard({
	id,
	name,
	color,
	collapsed = false,
}: // count,
TabgroupCardProps) {
	const [count, setCount] = useState(0);
	const [groupDetailIsOpen, setGroupDetailOpen] = useState(!collapsed);

	useEffect(() => {
		fetchTabGroupCount();
	}, []);

	async function fetchTabGroupCount() {
		const queryInfo = {
			groupId: id,
		};
		const tabNumbers = await chrome.tabs.query(queryInfo);
		setCount(tabNumbers.length);
	}

	function toggleGroupDetails(e: MouseEvent) {
		// e.preventDefault();

		// if (groupDetailIsOpen) {
		// 	minimizeGroup();
		// } else {
		// 	maximizeGroup();
		// }

		setGroupDetailOpen((prev) => !prev);
	}

	async function minimizeGroup(e?: MouseEvent) {
		e?.stopImmediatePropagation(); //prevents parent event getting triggered
		const updateProperties = {
			collapsed: true,
		};
		try {
			await chrome.tabGroups.update(id, updateProperties);
			setGroupDetailOpen(false);
		} catch (error) {}
	}
	async function maximizeGroup(e?: MouseEvent) {
		e?.stopImmediatePropagation();
		const updateProperties = {
			collapsed: false,
		};
		try {
			await chrome.tabGroups.update(id, updateProperties);
			setGroupDetailOpen(true);
		} catch (error) {}
	}

	function closeGroup() {
		//     const queryInfo = {
		// 	groupId: id,
		// };
		// try {
		// 	const tabsToClose = await chrome.tabs.query(queryInfo);
		// 	tabsToClose.forEach(async (item) => await chrome.tabs.remove(id));
		// 	// should remove the entry from the popup here
		// 	// const a = document.getElementById(`tabcard${groupId}`); // ID can't be numbers :/
		// 	// a.remove();
		// } catch (error) {}
	}

	return (
		<div
			className="tabgroupContainer"
			style={{ backgroundColor: Colors[color] }}>
			<div className="tabgroupCard" onClick={toggleGroupDetails}>
				<div className="tabgroupData">
					<span className="tabgroupName">{truncateText(name)}</span>
					<span style={{ color: Colors[color] }} className="tabgroupCount">
						{count}
					</span>
				</div>
				<div className="trafficLights">
					<TrafficLightButton
						onClick={minimizeGroup}
						icon="-"
						color="#febc30"
					/>
					<TrafficLightButton
						onClick={maximizeGroup}
						icon="⤢"
						color="#28c840"
					/>
					<TrafficLightButton onClick={closeGroup} icon="×" color="#fe5f58" />
				</div>
			</div>

			{groupDetailIsOpen && <GroupDetails id={id} />}
		</div>
	);
}

type TrafficProps = {
	icon: string;
	color: string;
	onClick: (event: MouseEvent) => void;
};

export function TrafficLightButton({ icon, color, onClick }: TrafficProps) {
	return (
		<button
			className="trafficButton"
			style={{ backgroundColor: color }}
			onClick={onClick}>
			{icon}
		</button>
	);
}
