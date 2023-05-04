import { useEffect, useState } from "preact/hooks";
import { Colors, CustomRule, customHint, getOneStorageItem } from "../const";
import { TrafficLightButton } from "../components/TrafficLightButton";
import { generateId, isValidUrl } from "../helpers";

export default function CustomModal({
	isVisible = false,
	toggleVisibility,
}: {
	isVisible: boolean;
	toggleVisibility: () => void;
}) {
	const [url, setUrl] = useState("");
	const [alias, setAlias] = useState("");
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

	function addNewRule() {
		const id = generateId();

		if (!isValidUrl(url)) {
			// set_status("Please enter a valid url.", "red");
		} else {
			const newRule: CustomRule = {
				id: id,
				url: url,
				alias: alias,
				color: color,
			};

			let newCustomRules = [...customRules, newRule];

			chrome.storage.sync.set(
				{
					customrules: newCustomRules,
				},
				function () {
					setCustomRules(newCustomRules);
					// Update status to let user know options were saved.
					setUrl("");
					setAlias("");
					setColor("");
				}
			);
		}
	}

	function onUrlChange(e) {
		if (e.target.value) {
			setUrl(e.target.value);
		}
	}
	function onAliasChange(e) {
		if (e.target.value) {
			setAlias(e.target.value);
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
								value={url}
								onInput={onUrlChange}
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
								value={alias}
								onInput={onAliasChange}
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
								{Object.entries(Colors).map(([k, v]) => (
									<option value={k} style={{ backgroundColor: v }}>
										{k}
									</option>
								))}
							</select>
						</div>

						<div class="inputblock">
							<label>&#10240;</label>
							<button onClick={addNewRule} id="addbutton">
								Add
							</button>
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
