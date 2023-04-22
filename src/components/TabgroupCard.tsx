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

	return (
		<div
			className="tabgroupCardContainer"
			style={{ backgroundColor: Colors[color] }}>
			<p>{name}</p>
			<p>{count}</p>
		</div>
	);
}
