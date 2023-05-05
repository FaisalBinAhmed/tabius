import { useEffect, useState } from "preact/hooks";
import { Colors, CustomRule, customHint, getOneStorageItem } from "../const";
import { TrafficLightButton } from "../components/TrafficLightButton";
import { generateId, isValidUrl } from "../helpers";
import { IconButton } from "../components/TrafficLightButton";

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

	function deleteRule(id: string) {
		let newArray = customRules.filter((item) => item.id !== id); // replace this with actually deleting the rule in the localstorage

		chrome.storage.sync.set(
			{
				customrules: newArray,
			},
			function () {
				setCustomRules(newArray);
				// set_status("Blacklisted site deleted.");
			}
		);
	}

	function editRule(
		id: string,
		newUrl: string,
		newAlias: string,
		newColor: chrome.tabGroups.ColorEnum
	) {
		const restArray = customRules.filter((item) => item.id !== id); //all other except current
		const editedRule: CustomRule = {
			id: id,
			url: newUrl,
			alias: newAlias,
			color: newColor,
		};

		restArray.push(editedRule);
		chrome.storage.sync.set(
			{
				customrules: restArray,
			},
			function () {
				// set_status("Custom Rule updated.");
				setCustomRules(restArray);
			}
		);
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
							color="#fe5f58"
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
						<div class="inputGap">
							<span>&#10132;</span>
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
								<CustomRuleCard
									key={rule.id}
									rule={rule}
									editRule={editRule}
									deleteRule={deleteRule}
								/>
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

function CustomRuleCard({
	rule,
	editRule,
	deleteRule,
}: {
	rule: CustomRule;
	editRule: (
		id: string,
		newUrl: string,
		newAlias: string,
		newColor: chrome.tabGroups.ColorEnum
	) => void;
	deleteRule: (id: string) => void;
}) {
	const [url, setUrl] = useState(rule.url);
	const [alias, setAlias] = useState(rule.alias);
	const [color, setColor] = useState<chrome.tabGroups.ColorEnum>(rule.color); //random??

	const [showEdit, setShowEdit] = useState(false);

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

	function confirmEdit() {
		if (!isValidUrl(url)) {
			// set_status("Please enter a valid url.", "red");
			return;
		}
		if (!alias.length) {
			// set_status("Alias can't be empty.", "red");
			return;
		}
		//everything should be valid here:

		editRule(rule.id, url, alias, color); //should be newcolor TODO
		setShowEdit(false);
	}
	return (
		<div
			class="rulecard"
			style={{
				backgroundColor: rule.color ? Colors[rule.color] : "black",
			}}>
			<div className="blockcardDetails" style={{ opacity: showEdit ? 1 : 0.8 }}>
				<input
					type="text"
					name="groupsite"
					value={url}
					onInput={onUrlChange}
					readOnly={!showEdit}
				/>

				<span>
					{"   "} &#10132; {"   "}
				</span>

				<input
					type="text"
					name="groupsite"
					value={alias}
					onInput={onAliasChange}
					readOnly={!showEdit}
				/>
			</div>
			<div class="trafficLights">
				{showEdit ? (
					<span className="trafficSpan">
						<TrafficLightButton
							tooltip="Save"
							icon="/icons/save-floppy-disk.svg"
							onClick={confirmEdit}
							color="#28c840"
						/>
						<TrafficLightButton
							tooltip="Cancel"
							icon="/icons/cancel.svg"
							onClick={() => setShowEdit(false)}
							color="orange"
						/>
					</span>
				) : (
					<span className="trafficSpan">
						<TrafficLightButton
							icon="/icons/edit-pencil.svg"
							color="#febc30"
							onClick={() => setShowEdit(true)}
							tooltip="Edit"
						/>
						<TrafficLightButton
							icon="/icons/trash.svg"
							color="#fe5f58"
							onClick={() => deleteRule(rule.id)}
							tooltip="Delete this rule"
						/>
					</span>
				)}
			</div>
		</div>
	);
}
