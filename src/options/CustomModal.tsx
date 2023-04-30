import { useEffect, useState } from "preact/hooks";
import { Colors, CustomRule, customHint, getOneStorageItem } from "../const";
import { TrafficLightButton } from "../components/TabgroupCard";

export default function CustomModal({
	isVisible = false,
	toggleVisibility,
}: {
	isVisible: boolean;
	toggleVisibility: () => void;
}) {
	const [color, setColor] = useState<chrome.tabGroups.ColorEnum>(""); //random??
	const [customRules, setCustomRules] = useState<CustomRule[]>([]);

	useEffect(() => {
		restoreCustomRules();
	}, []);

	async function restoreCustomRules() {
		const cr = await getOneStorageItem("customrules");
		if (cr?.customrules?.length) {
			setCustomRules(cr.customrules); //TODO type safe this
		}
	}

	function handleColor(e) {
		if (e.target.value) {
			setColor(e.target.value);
		}
	}

	return (
		<div class="modal" style={{ display: isVisible ? "block" : "none" }}>
			{/* <!-- Modal content --> */}
			<div class="modal-content">
				<div className="headercontainer">
					<div className="pophead">
						<div class="title">Custom Tab Grouping Rules</div>

						<TrafficLightButton
							icon="/icons/cancel.svg"
							color="red"
							onClick={toggleVisibility}
							tooltip="Close"
						/>
					</div>
					<div id="ruleinputcontainer">
						<div class="inputblock" style="flex: 1">
							<label for="groupsite">URL</label>
							<input
								type="text"
								placeholder="https://facebook.com"
								name="groupsite"
								id="customUrl"
							/>
						</div>
						<div class="inputblock">
							<label>&#10240;</label>
							<span style="margin-left: 5px; margin-right: 5px">&#10132;</span>
						</div>

						<div class="inputblock">
							<label for="groupalias">Short Name or Alias</label>
							<input
								type="text"
								id="customAlias"
								placeholder="FB"
								name="groupalias"
							/>
						</div>

						<div class="inputblock" style="margin-left: 5px">
							<label for="groupcolor">Group Color</label>
							<select
								id="colors"
								name="groupcolor"
								value={color}
								onChange={handleColor}>
								<option value="">Random</option>
								<option value="grey" style="background-color: #e0e0e0">
									grey
								</option>
								<option value="blue" style="background-color: #82b1ff">
									blue
								</option>
								<option value="red" style="background-color: #e57373">
									red
								</option>
								<option value="yellow" style="background-color: #fff176">
									yellow
								</option>
								<option value="green" style="background-color: #81c784">
									green
								</option>
								<option value="pink" style="background-color: #ff80ab">
									pink
								</option>
								<option value="purple" style="background-color: #ea80fc">
									purple
								</option>
								<option value="cyan" style="background-color: #84ffff">
									cyan
								</option>
							</select>
						</div>

						<div class="inputblock">
							<label>&#10240;</label>
							<button id="addbutton">Add</button>
						</div>
					</div>
					<p>{customHint}</p>
				</div>
				<div>
					<h3>Modify Existing Rules</h3>
					<div id="rulescontainer">
						{customRules?.length ? (
							customRules.map((rule) => (
								<div
									class="blockcard"
									style={{
										backgroundColor: rule.color ? Colors[rule.color] : "black",
									}}>
									<div className="blockcardDetails">
										<span>{rule.url}</span>
									</div>
									<div class="trafficLights">
										<TrafficLightButton
											icon="/icons/trash.svg"
											color="red"
											onClick={() => {}}
											tooltip="Delete this rule"
										/>
									</div>
								</div>
							))
						) : (
							<p>No Blacklisting rules yet. Blacklist a specific site above.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
