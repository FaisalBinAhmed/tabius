type TrafficProps = {
	icon: string;
	color: string;
	onClick: (event: MouseEvent) => void;
	tooltip?: string;
};

export function TrafficLightButton({
	icon,
	color,
	onClick,
	tooltip,
}: TrafficProps) {
	return (
		<div
			className="trafficButton"
			style={{ backgroundColor: color }}
			onClick={onClick}
			title={tooltip}>
			{/* {icon} */}
			<img
				class="trafficicon"
				src={icon}
				// onClick={handleOptionButton}
			/>
		</div>
	);
}
