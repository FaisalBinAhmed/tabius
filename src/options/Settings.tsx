import { render } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

import CustomModal from "./CustomModal";
import {
	GROUP_BY,
	GROUP_NAMING,
	getMultipleStorageItems,
	tabiusAscii,
} from "../const";
import BlockModal from "./BlockModal";
import ToastContextProvider, { ToastContext } from "../context/ToastContext";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ACTUAL SETTINGS COMPONENT BELOW

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Settings = () => {
	//Boolean values
	const [lonely, setLonely] = useState(false);
	const [autocollapse, setAutocollapse] = useState(false);
	const [regardless, setRegardless] = useState(false);

	//string values
	const [groupby, setGroupby] = useState<GROUP_BY>("sot");
	const [naming, setNaming] = useState<GROUP_NAMING>("dom");
	//number
	const [maximum, setMaximum] = useState(0);

	//toggling modals

	const [crIsVisible, setCrVisible] = useState(false);
	const [brIsVisible, setBrVisible] = useState(false);

	//toast notification

	const { showToastNotification } = useContext(ToastContext);

	function toggleCustomModal() {
		setCrVisible((prev) => !prev);
	}

	function toggleBlockModal() {
		setBrVisible((prev) => !prev);
	}

	useEffect(() => {
		restoreValues();
	}, []);

	async function restoreValues() {
		const items = await getMultipleStorageItems([
			"autocollapse",
			"blocklist",
			"customrules",
			"groupby",
			"lonely",
			"maximum",
			"naming",
			"regardless",
			"savedgroups",
			"savedgroupids",
		]);

		console.log(tabiusAscii, "\n", "USER SETTINGS: \n");
		chrome.storage.sync.get(console.log);

		setLonely(items.lonely);
		setAutocollapse(items.autocollapse);
		setRegardless(items.regardless);
		setMaximum(items.maximum);

		setGroupby(items.groupby);
		setNaming(items.naming);
	}

	async function saveSettings() {
		// setOneStorageObject("lonely", lonelyValue);
		// setOneStorageObject("autocollapse", autoCollapse);
		// setOneStorageObject("regardless", regardless);

		try {
			chrome.storage.sync.set(
				{
					groupby: groupby,
					naming: naming,
					regardless: regardless,
					maximum: maximum,
					lonely: lonely,
					autocollapse: autocollapse,
				},
				function () {
					// Update status to let user know options were saved.
					showToastNotification("Settings Saved", "green");
				}
			);
		} catch (error) {
			showToastNotification("Error saving item", "red");
		}
	}

	function toggleLonelyValue() {
		setLonely((prev) => !prev);
	}
	function toggleCollapseValue() {
		setAutocollapse((prev) => !prev);
	}
	function toggleRegardlessValue() {
		setRegardless((prev) => !prev);
	}

	
	function handleMaximum(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			setMaximum(parseInt(target.value));
		}
	}

	function handleGroupBy(e: Event) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			setGroupby(target.value as GROUP_BY);
		}
	}

	function handleNaming(e: HTMLElementEventMap["select"]) {
		const target = e.target as HTMLSelectElement;
		if (target.value) {
			setNaming(target.value as GROUP_NAMING);
		}
	}

	return (
		<div id="main">
			<div id="settingsmain">
				<div id="settingsheader">
					<div id="logocontainer">
						<img src="/icon.png" width="128px" height="128px" />
						<div id="textcontainer">
							<div id="title">Tabius 2</div>
							<div id="subtitle">Automatic Tab Grouping Assistant</div>
						</div>
					</div>
					<div class="promocontainer">
						<a
							class="headerbutton"
							href="https://www.buymeacoffee.com/faisalbin"
							target="_blank">
							&#9749; Buy me a coffee
						</a>
						<a
							class="headerbutton"
							href="https://faisalbin.com"
							target="_blank">
							&#127760; Visit Website
						</a>
						<a
							class="headerbutton"
							href="https://chrome.google.com/webstore/detail/tabius-tab-grouping-assis/enceimdjnaccoeikjobaeicfodlfnijp"
							target="_blank">
							&#128172; Rate/Review
						</a>
					</div>
				</div>
				<div class="oneoptioncontainer">
					<div id="langtext">Group By Option</div>
					<select id="groupby" value={groupby} onChange={handleGroupBy}>
						<option value="sot">same opening tab</option>
						<option value="sd">same domain</option>
					</select>
				</div>
				<p>
					Hint: by default tabs will be grouped together with the tab that
					opened it. However you can restrict this behavior to only group them
					when the new tab is from the same domain.
				</p>

				<div id="alttext">
					<label>
						<input
							type="checkbox"
							id="regardless"
							checked={regardless}
							onClick={toggleRegardlessValue}
						/>
						Combine tabs inside existing groups regardless of domain
					</label>
				</div>
				<p>
					Hint: if you want to put new tabs opened from an existing group to
					reside in the group regardless of the "group by same domain" policy.
					Only applicable when "same domain" has been chosen as the group by
					option.
				</p>

				<div class="oneoptioncontainer">
					<div id="langtext">Group Naming Convention</div>
					<select id="naming" value={naming} onChange={handleNaming}>
						<option value="dom">domain</option>
						<option value="subdom">subdomain.domain</option>
						<option value="subdomtld">subdomain.domain.tld</option>
						<option value="title">Group opener's title</option>
						<option value="nameless">nameless (no name)</option>
					</select>
				</div>
				<p>
					Hint: by default the group will be named after domain:
					dev.facebook.com -&gt; facebook.
				</p>

				<div class="oneoptioncontainer">
					<div id="langtext">Maximum number of tabs per group</div>
					<input
						id="maximum"
						type="number"
						onInput={handleMaximum}
						value={maximum}
						min="0"
						max="999"
					/>
				</div>
				<p>
					0 (default) = no restrictions ~ unlimited tabs.
					<b>1 = Tabius has no effects</b> (not applicable). 2 - 999 = maximum
					number of tabs.
				</p>
				<div id="popuptext">
					<label>
						<input
							type="checkbox"
							onClick={toggleLonelyValue}
							id="lonely"
							checked={lonely}
						/>
						Remove group when there is only 1 tab left
					</label>
				</div>
				<p>
					Hint: If the number of tab in a group becomes 1, this will ungroup the
					remaining 'lonely' tab.
				</p>

				<div id="popuptext">
					<label>
						<input
							type="checkbox"
							onClick={toggleCollapseValue}
							id="autocollapse"
							checked={autocollapse}
						/>
						Auto collapse inactive tab groups
					</label>
				</div>
				<p>
					Hint: if the current tab is not part of a tab group, the extension
					will collapse all other tab groups automatically.
				</p>

				<div style="display: flex">
					<span style="flex: 1"></span>
					<button id="myBtn" onClick={toggleCustomModal}>
						Custom Rules
					</button>
					<button id="blockBtn" onClick={toggleBlockModal}>
						Blacklist
					</button>
					<span style="flex: 1"></span>
				</div>
				{/* <p>Hint: Blocklist will always get precendence over Custom Rules.</p> */}
				<div style="display: flex">
					<div style="flex: 1"></div>
					<button id="save" onClick={saveSettings}>
						Save Settings
					</button>
					<div style="flex: 1"></div>
				</div>
			</div>
			<CustomModal
				isVisible={crIsVisible}
				toggleVisibility={toggleCustomModal}
			/>
			<BlockModal isVisible={brIsVisible} toggleVisibility={toggleBlockModal} />
		</div>
	);
};

// context needs to be set one level above the consuming components to work !!! IMPORTANT
render(
	<ToastContextProvider>
		<Settings />
	</ToastContextProvider>,
	document.getElementById("settings")!
);
