import { TrafficLightButton } from "../components/TrafficLightButton";
import { getOneStorageItem, type SavedGroup } from "../const";

type ExportImportModalProps = {
	isVisible: boolean;
	toggleVisibility: () => void;
};

function exportTabGroups(groups: SavedGroup[]) {
	const json = JSON.stringify(groups, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	const fileName = `tabius_saved_groups_${crypto.randomUUID()}.json`;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export const ExportImportModal = ({
	isVisible,
	toggleVisibility,
}: ExportImportModalProps) => {
	const exportGroups = async () => {
		const savedGroups = await getOneStorageItem("savedgroups");
		if (savedGroups?.savedgroups?.length) {
			exportTabGroups(savedGroups.savedgroups);
		}
	};

	return (
		<div style={{ display: isVisible ? "block" : "none" }} class="modal">
			{/* <!-- Modal content --> */}
			<div class="block-modal-content">
				<div className="headercontainer">
					<div className="pophead">
						<div class="title">Export/Import Saved Tab Groups</div>
						<TrafficLightButton
							icon="/icons/cancel.svg"
							color="#fe5f58"
							onClick={toggleVisibility}
							tooltip="Close"
						/>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
							padding: "1rem",
						}}
					>
						<p>
							Export your saved tab groups to a file. You can import them later.
						</p>
						<button
							type={"button"}
							style={{
								cursor: "pointer",
							}}
							onClick={exportGroups}
							id="blockaddbutton"
						>
							Export
						</button>
					</div>
				</div>
				<div>
					<div id="blockcontainer">
						<div
							style={{
								padding: "1rem",
								display: "flex",
								flexDirection: "column",
							}}
						>
							<h3>Import</h3>
							<p>Import your saved tab groups from a json file.</p>
							<p>
								Please make sure it is a file previously exported from Tabius.
								Otherwise, the import process will fail.
							</p>

							<input
								type="file"
								id="fileinput"
								style={{
									padding: "1rem",
									margin: "1rem",
									border: "1px solid #ccc",
									borderRadius: "5px",
									width: "100%",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
