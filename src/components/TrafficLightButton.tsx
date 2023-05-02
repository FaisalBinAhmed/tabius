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
			<img class="trafficicon" src={icon} />
		</div>
	);
}

export function IconButton({
	icon,
	color,
	onClick,
	tooltip,
	title,
}: TrafficProps & { title: string }) {
	return (
		<div
			className="iconButton"
			style={{ backgroundColor: color }}
			onClick={onClick}
			title={tooltip}>
			<img class="trafficicon" src={icon} />
			<h4>{title}</h4>
		</div>
	);
}
