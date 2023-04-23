import { useEffect, useState } from "preact/hooks";
import { Colors } from "../const";

type TabgroupCardProps = {
	id: number;
	name?: string;
	color: chrome.tabGroups.ColorEnum;
	// count?: number;
};

export default function TabgroupCard({
	id,
	name,
	color,
}: // count,
TabgroupCardProps) {
	const [count, setCount] = useState(0);

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

	async function minimizeGroup() {
		const updateProperties = {
			collapsed: true,
		};
		try {
			await chrome.tabGroups.update(id, updateProperties);
		} catch (error) {}
	}
	async function maximizeGroup() {
		const updateProperties = {
			collapsed: false,
		};
		try {
			await chrome.tabGroups.update(id, updateProperties);
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
		<div className="tabgroupCard" style={{ backgroundColor: Colors[color] }}>
			<div className="tabgroupData">
				<span>{name}</span>
				<span> → {count}</span>
			</div>
			<div className="trafficLights">
				<TrafficLightButton onClick={minimizeGroup} icon="-" color="#febc30" />
				<TrafficLightButton onClick={maximizeGroup} icon="⤢" color="#28c840" />
				<TrafficLightButton onClick={closeGroup} icon="x" color="#fe5f58" />
			</div>
		</div>
	);
}

type TrafficProps = {
	icon: string;
	color: string;
	onClick: () => void;
};

function TrafficLightButton({ icon, color, onClick }: TrafficProps) {
	return (
		<button
			className="trafficButton"
			style={{ backgroundColor: color }}
			onClick={onClick}>
			{icon}
		</button>
	);
}
