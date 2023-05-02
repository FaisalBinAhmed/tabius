import { useEffect, useState } from "preact/hooks";
import { truncateText } from "./TabgroupCard";
import { TrafficLightButton } from "./TrafficLightButton";

type GroupDetailsProps = {
	id: number;
};

export default function GroupDetails({ id }: GroupDetailsProps) {
	const [gDetails, setGDetails] = useState<chrome.tabs.Tab[]>();

	useEffect(() => {
		fetchGroupDetails();
	}, []);

	async function fetchGroupDetails() {
		const queryInfo = {
			groupId: id,
		};
		try {
			const tabsInTheGroup = await chrome.tabs.query(queryInfo);
			console.log(tabsInTheGroup);
			setGDetails(tabsInTheGroup);
		} catch (error) {}
	}

	return (
		<div className="tabscontainer">
			{gDetails?.map((tab) => (
				<TabCard id={tab.id} favIconUrl={tab.favIconUrl} title={tab.title} />
			))}
		</div>
	);
}

type TabCardProps = {
	id?: number;
	favIconUrl?: string;
	title?: string;
};

function TabCard({ favIconUrl, title }: TabCardProps) {
	return (
		<div className="tabcard">
			<div className="tabdetails">
				{favIconUrl ? (
					<img
						width="18px"
						height="18px"
						style={{ marginRight: "5px" }}
						src={favIconUrl}
					/>
				) : (
					<img
						width="18px"
						height="18px"
						style={{ marginRight: "5px" }}
						src="/icons/media-image.svg"
					/>
				)}
				{truncateText(title, 30)}
			</div>
			<div className="trafficLights">
				<TrafficLightButton
					onClick={() => {}}
					icon="/icons/eject.svg"
					color="#ffa300"
					tooltip="Eject this tab from the group"
				/>
				<TrafficLightButton
					onClick={() => {}}
					icon="/icons/cancel.svg"
					color="#fe5f58"
					tooltip="Close this tab"
				/>
			</div>
		</div>
	);
}
