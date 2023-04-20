import { render } from "preact";
import CustomModal from "./CustomModal";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ACTUAL SETTINGS COMPONENT BELOW

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openCustomModal() {
	let modal = document.getElementById("myModal")!;
	modal.style.display = "block";
	// restore_custom_rules();
}

const Settings = () => {
	return (
		<div id="main">
			<div id="settingsmain">
				<div id="settingsheader">
					<div id="logocontainer">
						<img src="/icon.png" width="128px" height="128px" />
						<div id="textcontainer">
							<div id="title">Tabius</div>
							<div id="subtitle">Tab Grouping Assistant</div>
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
							href="https://forms.gle/9wBKmTuYpxfrJxGY9"
							target="_blank">
							&#128172; Send Feedback
						</a>
					</div>
				</div>
				<div class="oneoptioncontainer">
					<div id="langtext">Group By Option</div>
					<select id="groupby">
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
						<input type="checkbox" id="regardless" />
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
					<select id="naming">
						<option value="dom">domain</option>
						<option value="subdom">subdomain.domain</option>
						<option value="subdomtld">subdomain.domain.tld</option>
					</select>
				</div>
				<p>
					Hint: by default the group will be named after domain:
					dev.facebook.com -&gt; facebook.
				</p>

				<div class="oneoptioncontainer">
					<div id="langtext">Maximum number of tabs per group</div>
					<input id="maximum" type="number" value="0" min="0" max="999" />
				</div>
				<p>
					0 (default) = no restrictions ~ unlimited tabs.
					<b>1 = no effects</b> (not applicable). 2 - 999 = maximum number of
					tabs.
				</p>
				<div id="popuptext">
					<label>
						<input type="checkbox" id="lonely" />
						Remove group when there is only 1 tab left
					</label>
				</div>
				<p>
					Hint: If the number of tab in a group becomes 1, this will ungroup the
					remaining 'lonely' tab.
				</p>

				<div id="popuptext">
					<label>
						<input type="checkbox" id="autocollapse" />
						Auto collapse inactive tab groups
					</label>
				</div>
				<p>
					Hint: if the current tab is not part of a tab group, the extension
					will collapse all other tab groups automatically.
				</p>

				<div style="display: flex">
					<span style="flex: 1"></span>
					<button id="myBtn" onClick={openCustomModal}>
						Custom Rules
					</button>
					<button id="blockBtn">Blacklist</button>
					<span style="flex: 1"></span>
				</div>
				{/* <p>Hint: Blocklist will always get precendence over Custom Rules.</p> */}
				<div style="display: flex">
					<div style="flex: 1"></div>
					<button id="save">Save Settings</button>
					<div style="flex: 1"></div>
				</div>
			</div>

			<CustomModal />

			{/* settingMain */}
		</div>
	);
};

render(<Settings />, document.getElementById("settings")!);
