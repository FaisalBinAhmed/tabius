type TabgroupCardProps = {
	id: string;
	name: string;
	color: string;
	count: number;
};

export default function TabgroupCard({
	id,
	name,
	color,
	count,
}: TabgroupCardProps) {
	return (
		<div className="tabgroupCardContainer" style={{ backgroundColor: color }}>
			<p>{name}</p>
			<p>{count}</p>
		</div>
	);
}
